import os
import urllib.request
from flask import Flask, flash, request, redirect, render_template, jsonify
from werkzeug.utils import secure_filename
from flask import Flask
import pandas as pd
import pickle
from rapidfuzz import process, fuzz
import requests

app = Flask(__name__,static_url_path='/Static')
app.config['location'] = "./Static"
data=pd.read_csv('movie_data.csv')
model=pickle.load(open("model", 'rb'))


def give_recommender_movie(title):
    idx=process.extractOne(title, data['original_title'])[2]
    sig_score=list(enumerate(model[idx]))
    sig_score=sorted(sig_score,key=lambda X:X[1],reverse=True)
    sig_score=sig_score[1:20]
    movie_indices=[i[0] for i in sig_score]
    temp=data['original_title'].iloc[movie_indices].index
    rec_movies={}
    name=[]
    image=[]
    for i in temp:
        name.append(data.iloc[i].original_title)
        image.append(data.iloc[i].poster)
    image=["data:image/png;base64,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" if x != x else x for x in image]
    rec_movies['name']=name
    rec_movies['image']=image
    return rec_movies


def get_movie_info(name):
    idd=process.extractOne(name, data['original_title'])[2]
    movie_overview={}
    movie_overview['name']=data.iloc[idd].original_title
    movie_overview['overview']=data.iloc[idd].overview
    movie_overview['release_date']=data.iloc[idd].release_date
    movie_overview['runtime']=float(data.iloc[idd].runtime)
    movie_overview['original_language']=data.iloc[idd].original_language
    movie_overview['revenue']=int(data.iloc[idd].revenue)
    movie_overview['status']=data.iloc[idd].status
    movie_overview['image']=data.iloc[idd].poster


    return movie_overview



@app.route('/')
def upload_form():
    return render_template('main.html')

@app.route('/get_movies', methods=['POST'])
def get_movies():
    data=request.form['id']
    resp = jsonify({"movie_info":get_movie_info(data) , "rec_movies":give_recommender_movie(data)})
    resp.status_code = 200
    return resp


if __name__ == "__main__":
    app.run(debug=True)