from IPython.display import Image, display

from app.core.openai.graphs.chatbot import graph

try:
    display(
        Image(graph.get_graph().draw_mermaid_png(output_file_path="chatbot_graph.png")),
    )
except Exception:
    # This requires some extra dependencies and is optional
    pass
