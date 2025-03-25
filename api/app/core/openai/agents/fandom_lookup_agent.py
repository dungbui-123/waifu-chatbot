import array
from langchain.prompts.prompt import PromptTemplate
from langchain.agents import (
    create_react_agent,
    AgentExecutor,
)
from langchain import hub

from app.core.openai.tools.search import search_fandom_page_tool
from ..azure import llm


def fandom_lookup(name: str) -> str:
    template = """given the character {character_name} I want you to get it me a link to their Wiki Fandom page.
                              Your answer should contain only a URL"""

    prompt_template = PromptTemplate(
        template=template, input_variables=["character_name"]
    )
    tools_for_agent = [search_fandom_page_tool]

    react_prompt = hub.pull("hwchase17/react")
    agent = create_react_agent(llm=llm, tools=tools_for_agent, prompt=react_prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools_for_agent, verbose=True)

    result = agent_executor.invoke(
        input={"input": prompt_template.format_prompt(character_name=name)}
    )

    fandom_url = result["output"]
    return fandom_url


def generate_prompt_from_character_info(character_infos: array) -> str:
    template = """
    You are now assuming the role of the following character:

    {character_infos}

    From this moment onward, all of your responses must fully embody this character's personality, style, and perspective. Make sure your tone, mannerisms, and language reflect the essence of this character.
    """

    # Create the prompt template with the specified input variable
    prompt_template = PromptTemplate(
        input_variables=["character_infos"], template=template
    )

    return prompt_template.format_prompt(character_infos=character_infos).to_string()
