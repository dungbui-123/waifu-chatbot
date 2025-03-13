# Generate random thread id
import re
import uuid

from app.core.db.database import SessionDep
from app.models.thread import Thread
from langchain.prompts.prompt import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from app.core.openai.azure import llm


def generate_thread_title(first_message: str):
    summary_template = """
        Create a catchy and concise thread title, between 2 to 5 words, based on the following message: {message}
    """

    summary_prompt_template = PromptTemplate(
        input_variables=["message"], template=summary_template
    )

    chain = summary_prompt_template | llm | StrOutputParser()

    return re.sub(r'"', "", chain.invoke(input={"message": first_message}))


def generate_thread_id(first_message: str, session: SessionDep):
    new_id = str(uuid.uuid4())

    # Save thread to postgres database
    thread = Thread(
        id=new_id, title=generate_thread_title(first_message=first_message), user_id=1
    )
    session.add(thread)
    session.commit()

    return new_id
