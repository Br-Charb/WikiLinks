// Created by Daniel on 3/26/2026.

#ifndef WIKILINKS_GRAPH_H
#define WIKILINKS_GRAPH_H

#include <unordered_map>
#include <vector>
#include <string>

using namespace std;

class Graph {

public:

    void loadGraph(string& filename);
    void saveBinary(string& baseName);
    void loadBinary(string& baseName);

    int getIndex(string& id);
    string getName(int index);

    unordered_map<string, int> id_to_index;
    vector<string> index_to_id;
    vector<vector<int>> graph;
    vector<int> weight;

private:
    int mapIndex(string& id);

};


#endif //WIKILINKS_GRAPH_H
