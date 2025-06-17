# From Quotes to Concepts: Axial Coding of Political Debates with Ensemble LMs

This project presents a structured pipeline for inductive qualitative analysis of Dutch parliamentary debates using language models (LLMs) and unsupervised clustering. We extract low-level codes, group them into higher-order concepts through axial coding, and visualize the result as a hierarchical concept graph.

---

## Project Goals

- Generate open codes from debate transcripts using LLM ensembles

- Group semantically related codes into axial categories

- Compare LLM-moderated and clustering-based approaches to axial coding

- Construct interpretable concept graphs for qualitative analysis

- Evaluate outputs both with and without gold-standard taxonomies

##  Method Overview

Our pipeline consists of three main stages:

### 1. Open Coding (LLM Ensemble)
Concise codes are generated for each utterance using multiple fine-tuned LLMs (e.g., LLaMA3, Falcon, Mistral), followed by a moderator model (e.g., Mixtral or Groq LLaMA3) that selects a refined label.

### 2. Axial Coding
We explore two strategies for grouping open codes into categories:
- **Clustering-Based**: HDBSCAN, KMeans, spectral, and other clustering methods using embeddings of codes, utterances, or both.
- **Direct LLM Grouping**: A language model is prompted to directly generate axial categories from examples, simulating human axial coding behavior.

### 3. Concept Graph Construction
We construct a graph where:
- Nodes represent **utterances**, **codes**, and **categories**
- Edges represent inclusion or semantic relationships
- Edge weights can encode strength of association

---

## 📊 Evaluation

We include both reference-based and unsupervised evaluation:

### With Human Taxonomy
- Composite Score (multi-metric alignment with gold-standard labels)
- ROUGE
- BERTScore

### Without Gold Labels
Following Chen et al. (2024), we use:

- **Concept Space Coverage (CSC)** — semantic diversity
- **Label Coherence** — intra-category similarity
- **Code Brevity** — average code length
- **Conceptual Overlap** — multi-category membership

---

## Dataset

The corpus includes:
- Transcripts of Dutch parliamentary debates
- Speaker metadata (name, party, role)
- Timestamps
- A human-coded topic taxonomy for optional comparison

---

##  Visualizations

- PCA & UMAP projections of code embeddings
- Hierarchical ReactFlow graphs of concepts
- Party-level distribution of topics
- Cluster-label networks with Plotly and NetworkX



