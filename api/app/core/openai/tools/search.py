from langchain_community.tools.tavily_search import TavilySearchResults

from langchain_core.tools import Tool


def search_profile_url_tavily(name: str) -> str:
    """Searches for Linkedin or Twitter Profile Page."""
    search = TavilySearchResults()
    res = search.run(f"{name}")
    return res[0]["url"]


search_linkedin_profile_tool = Tool(
    name="Crawl Google 4 linkedin profile page",
    func=search_profile_url_tavily,
    description="useful for when you need get the Linkedin Page URL",
)

search_user_question_tool = TavilySearchResults(max_results=2)
