#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test script for WebMind Graph cross-document fusion algorithms.
This script demonstrates the core functionality.
"""

import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from backend.graph_builder import GraphBuilder, create_mock_graph_data


def main():
    print("=== WebMind Graph - Cross-Document Fusion Test ===")
    print("=" * 60)

    # Initialize graph builder
    builder = GraphBuilder()

    print("\n📚 Creating mock data for 3 articles...")

    # Article 1: AI Revolution
    article1 = create_mock_graph_data(
        "article1",
        "Artificial Intelligence Revolution",
        [
            {"name": "Artificial Intelligence", "type": "tech", "weight": 0.95},
            {"name": "Machine Learning", "type": "theory", "weight": 0.85},
            {"name": "Deep Learning", "type": "tech", "weight": 0.90},
            {"name": "Neural Networks", "type": "tech", "weight": 0.80}
        ],
        [
            {"source": "Artificial Intelligence", "target": "Machine Learning", "relation": "includes", "sentiment": "support"},
            {"source": "Machine Learning", "target": "Deep Learning", "relation": "subfield_of", "sentiment": "support"},
            {"source": "Deep Learning", "target": "Neural Networks", "relation": "uses", "sentiment": "support"}
        ]
    )

    # Article 2: ML Applications
    article2 = create_mock_graph_data(
        "article2",
        "Machine Learning Applications",
        [
            {"name": "Machine Learning", "type": "theory", "weight": 0.90},
            {"name": "Deep Learning", "type": "tech", "weight": 0.85},
            {"name": "Natural Language Processing", "type": "tech", "weight": 0.80},
            {"name": "AI Applications", "type": "concept", "weight": 0.75}
        ],
        [
            {"source": "Machine Learning", "target": "Natural Language Processing", "relation": "enables", "sentiment": "support"},
            {"source": "Deep Learning", "target": "Natural Language Processing", "relation": "powers", "sentiment": "support"},
            {"source": "AI Applications", "target": "Machine Learning", "relation": "uses", "sentiment": "support"}
        ]
    )

    # Article 3: AI Controversies (with controversial relations)
    article3 = create_mock_graph_data(
        "article3",
        "Controversies in AI Development",
        [
            {"name": "Artificial Intelligence", "type": "tech", "weight": 0.92},
            {"name": "Machine Learning", "type": "theory", "weight": 0.88},
            {"name": "AI Ethics", "type": "concept", "weight": 0.85},
            {"name": "Deep Learning", "type": "tech", "weight": 0.82}
        ],
        [
            {"source": "Artificial Intelligence", "target": "AI Ethics", "relation": "raises", "sentiment": "neutral"},
            {"source": "Machine Learning", "target": "AI Ethics", "relation": "involves", "sentiment": "oppose"},
            {"source": "Deep Learning", "target": "AI Ethics", "relation": "challenges", "sentiment": "oppose"},
            {"source": "Artificial Intelligence", "target": "Machine Learning", "relation": "includes", "sentiment": "oppose"}
        ]
    )

    print(f"✅ Article 1 created: {article1['title']}")
    print(f"✅ Article 2 created: {article2['title']}")
    print(f"✅ Article 3 created: {article3['title']}")

    print("\n🔗 Converting to graph format...")

    def convert_to_graph_format(data):
        nodes = []
        for entity in data["entities"]:
            nodes.append({
                "id": entity["name"].lower().replace(" ", "_"),
                "label": entity["name"],
                "type": entity["type"],
                "weight": entity["weight"]
            })

        edges = []
        for relation in data["relations"]:
            edges.append({
                "source": relation["source"].lower().replace(" ", "_"),
                "target": relation["target"].lower().replace(" ", "_"),
                "type": relation["relation"],
                "weight": 1.0,
                "sentiment": relation["sentiment"]
            })

        return {"nodes": nodes, "edges": edges}

    # Merge all articles
    print("\n🔄 Merging articles into knowledge graph...")
    builder.merge_graph_data(convert_to_graph_format(article1), article1["article_id"])
    builder.merge_graph_data(convert_to_graph_format(article2), article2["article_id"])
    builder.merge_graph_data(convert_to_graph_format(article3), article3["article_id"])

    # Export and print statistics
    print("\n📊 Exporting graph and calculating statistics...")
    graph_data = builder.export_graph()

    print("\n" + "=" * 60)
    print("📈 Final Graph Statistics")
    print("=" * 60)
    print(f"Nodes:                {graph_data['stats']['node_count']}")
    print(f"Edges:                {graph_data['stats']['edge_count']}")
    print(f"Controversial Edges:  {graph_data['stats']['controversial_edges_count']}")
    print(f"Articles:             {graph_data['stats']['articles_count']}")
    print(f"Connected Components: {graph_data['stats']['connected_components']}")

    print("\n" + "=" * 60)
    print("🎯 Nodes by Frequency")
    print("=" * 60)
    for i, node in enumerate(sorted(graph_data["nodes"], key=lambda x: x["frequency"], reverse=True), 1):
        print(f"{i:2d}. {node['label']:<30} Freq: {node['frequency']:2d} Size: {node['size']:.1f}")

    print("\n" + "=" * 60)
    print("🔥 Controversial Relations")
    print("=" * 60)
    controversial_edges = [edge for edge in graph_data["edges"] if edge["controversial"]]
    if controversial_edges:
        for edge in controversial_edges:
            source_node = next(n for n in graph_data["nodes"] if n["id"] == edge["source"])
            target_node = next(n for n in graph_data["nodes"] if n["id"] == edge["target"])
            print(f"• {source_node['label']} → {target_node['label']} ({edge['type']})")
            print(f"  Sentiments: {', '.join(edge['sentiments'])}")
            print(f"  Articles:   {len(edge['articles'])}")
    else:
        print("No controversial relations detected")

    print("\n✅ Test completed successfully!")


if __name__ == "__main__":
    main()