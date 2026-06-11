import os

class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///speech.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False