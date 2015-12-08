import json
from pymongo import MongoClient

def load_state_list():
    state_abbr = {}
    with open('state_abbr.json', 'r') as state_abbr_file:
        state_abbr = json.loads(state_abbr_file.read())

    return state_abbr

def city_to_state(loc_string, state_abbr):
    if loc_string != "Anonymous Location":
        state = loc_string[loc_string.rfind(',') + 2: ]
        return state_abbr[state]
    else:
        return loc_string

def load_into_comments(comment):
    client = MongoClient("mongodb://USERNAME:PASSWORD@ds041561.mongolab.com:41561/berniebuddy")
    db = client["berniebuddy"]
    comment_collection = db.comments

    print("Re-inserted: {}".format(comment_collection.update_one({ "_id": comment["_id"] }, {"$set": { "location": comment["location"] }})))

if __name__ == "__main__":
    client = MongoClient("mongodb://USERNAME:PASSWORD@ds041561.mongolab.com:41561/berniebuddy")
    db = client["berniebuddy"]
    comment_collection = db.comments
    state_abbr = load_state_list()

    for comment in comment_collection.find({}):
        result = city_to_state(comment["location"], state_abbr)
        comment["location"] = result
        load_into_comments(comment)
