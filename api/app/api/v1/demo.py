from fastapi import APIRouter
from langchain.prompts.prompt import PromptTemplate
from langchain_core.output_parsers import StrOutputParser


from app.core.openai.agents.linkedin_lookup_agent import lookup
from app.core.openai.azure import llm


router = APIRouter(tags=["demo"], prefix="/demo")


@router.get("/demo")
async def demo():
    return llm.invoke("hello")


@router.post("/summary")
async def summary_information(data: str):
    summary_template = """
        given the information {information} about a person I want you to create:
        1. A short summary
        2. two interesting facts about them
    """

    summary_prompt_template = PromptTemplate(
        input_variables=["information"], template=summary_template
    )

    chain = summary_prompt_template | llm | StrOutputParser()

    return chain.invoke(input={"information": data})


@router.post("/search")
async def search_linkedin_profile(data: str):
    return lookup(data)
