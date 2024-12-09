import re
from bs4 import BeautifulSoup, SoupStrainer

def_strainer = SoupStrainer(class_ = 'content')

def bs4_extractor(html: str, strainer: SoupStrainer = def_strainer) -> str:
    '''
    Extract text from html using BeautifulSoup
    '''
    soup = BeautifulSoup(html, "lxml", parse_only=strainer)
    return re.sub(r"\n\n+", "\n\n", soup.text).strip()