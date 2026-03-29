// Created by Daniel on 3/28/2026.

#include "graph.h"
#include <iostream>

using namespace std;

int main() {
    Graph g;

    string csvFile = "../data/links_export.csv";
    string outputBase = "../data/wiki_graph";

    g.loadGraph(csvFile);
    g.saveBinary(outputBase);

    cout << "One-time graph build complete.\n";
    return 0;
}