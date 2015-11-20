import datetime
from pymongo import MongoClient
import random

if __name__ == "__main__":
    client = MongoClient("mongodb://root_dev:bernie_dev@ds035674.mongolab.com:35674/berniebuddydev")
    db = client["berniebuddydev"]

    item_collection = db.posts
    for i in range(1, 250):
        inserted_item = item_collection.insert({ "post": i, "creatorId": "GR2pN2tTR4CoKPCEb", "score": 0, "location": "The Dump", "active": True, "createdAt": datetime.datetime.now() + datetime.timedelta(minutes=i+10) })
        print("Inserted: {0}".format(inserted_item))
