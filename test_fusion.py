from backend.graph_builder import GraphBuilder, create_mock_graph_data


def test_graph_builder_merges_same_named_nodes():
    builder = GraphBuilder(model_name="mock")
    graph_one = create_mock_graph_data(
        article_id="a1",
        title="AI Systems",
        entities=[
            {"name": "Artificial Intelligence", "type": "theme", "weight": 3},
            {"name": "Machine Learning", "type": "concept", "weight": 2},
        ],
    )
    graph_two = create_mock_graph_data(
        article_id="a2",
        title="AI Applications",
        entities=[
            {"name": "artificial intelligence", "type": "theme", "weight": 4},
            {"name": "Automation", "type": "concept", "weight": 2},
        ],
    )

    builder.merge_graph_data(graph_one, article_id="a1")
    builder.merge_graph_data(graph_two, article_id="a2")
    exported = builder.export_graph()

    ai_nodes = [node for node in exported["nodes"] if node["label"].lower() == "artificial intelligence"]
    assert len(ai_nodes) == 1
    assert exported["metadata"]["article_count"] == 2
    assert exported["metadata"]["node_count"] >= 4
