from pymongo import MongoClient
import sys

client = MongoClient("mongodb://root:bernie@ds041561.mongolab.com:41561/berniebuddy")
db = client["berniebuddy"]

def find_all_users():
    return db.users.find()

def calculate_user_kudos(id):
    return 0

def add_kudos_to_user_record(id, kudos):
    item_collection = db.users
    update_query = { "$set": { "kudos": kudos } }
    print("Setting {}'s kudos to {}'".format(id, update_query))
    updated_item = item_collection.update({ "_id": id }, update_query)
    print("Inserted: {0}".format(updated_item))

if __name__ == "__main__":
    users = find_all_users()
    print(users)
    for user in users:
        kudos = calculate_user_kudos(user["_id"])
        add_kudos_to_user_record(user["_id"], kudos)
