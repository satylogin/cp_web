from urllib.request import urlopen
from bs4 import BeautifulSoup
html = urlopen("https://www.codechef.com/users/alexvaleanu")
bsob = BeautifulSoup(html.read())
rating = bsob.find("div",{"class":"rating-number"})
print(rating.get_text())
#for rat in rating:
#    print(rat.get_text())
