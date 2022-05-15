import requests

print("Start to clean books data")
url = "http://localhost:8000/book/"
r = requests.delete(url)
url = "http://localhost:8001/api/deleteall"
r = requests.delete(url)
print("End to clean books data")

print("Start to clean user data")
url = "http://localhost:8000/api/auth/deleteusers"
r = requests.delete(url)
print("End to clean user data")