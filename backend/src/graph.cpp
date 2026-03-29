// Created by Daniel on 3/23/2026.

#include "graph.h"

#include <iostream>
#include <unordered_map>
#include <vector>
#include <string>
#include <fstream>
#include <sstream>

using namespace std;

// Maps string ID to int
int Graph::mapIndex(string &id)
{

    if (id_to_index.count(id))
    {
        return id_to_index[id];
    }

    int id2 = index_to_id.size();
    id_to_index[id] = id2;
    index_to_id.push_back(id);

    return id2;
}

int Graph::getIndex(string &id)
{
    if (!id_to_index.count(id))
    {
        return -1;
    }
    return id_to_index[id];
}

string Graph::getName(int index)
{
    return index_to_id[index];
}

// Load CSV
void Graph::loadGraph(string &filename)
{

    ifstream file(filename);
    string line;

    getline(file, line); // Pretty sure there's a header so just skipping it

    long long edgeCount = 0;

    while (getline(file, line))
    {

        stringstream ss(line);
        string id_discard;
        string from;
        string to;

        getline(ss, id_discard, ','); // Skip ID
        getline(ss, from, ',');       // source_title
        getline(ss, to, ',');         // target_title

        int x = mapIndex(from);
        int y = mapIndex(to);

        if (x >= graph.size())
        {
            graph.resize(x + 1);
        }

        if (y >= graph.size())
        {
            graph.resize(y + 1);
        }

        graph[x].push_back(y);
        edgeCount++;

        cout << "loaded " << edgeCount << " edges" << endl;
    }

    // Build weights based on length of title
    weight.resize(index_to_id.size());
    for (int i = 0; i < index_to_id.size(); i++)
    {
        weight[i] = index_to_id[i].length();
    }

    cout << "Loaded graph with " << graph.size() << " nodes, " << index_to_id.size() << " edges." << endl;
}

void Graph::saveBinary(string &baseName)
{

    ofstream titlesFile(baseName + "_titles.txt");
    ofstream graphFile(baseName + "_graph.bin", ios::binary);
    ofstream weightFile(baseName + "_weights.bin", ios::binary);

    if (!titlesFile.is_open() || !graphFile.is_open() || !weightFile.is_open())
    {
        cout << "Error: could not open files" << endl;
        return;
    }

    int numTitles = index_to_id.size();
    titlesFile << numTitles << '\n';
    for (string &title : index_to_id)
    {
        titlesFile << title << '\n';
    }

    int numNodes = graph.size();
    graphFile.write(reinterpret_cast<char *>(&numNodes), sizeof(int));

    for (auto &neighbors : graph)
    {

        int curSize = neighbors.size();
        graphFile.write(reinterpret_cast<char *>(&curSize), sizeof(int));

        if (curSize > 0)
        {
            graphFile.write(reinterpret_cast<char *>(neighbors.data()), curSize * sizeof(int));
        }
    }

    int weightSize = weight.size();
    weightFile.write(reinterpret_cast<char *>(&weightSize), sizeof(int));

    if (weightSize > 0)
    {

        weightFile.write(reinterpret_cast<char *>(weight.data()), weightSize * sizeof(int));
    }

    cout << "Saved graph files" << endl;
}

void Graph::loadBinary(string &baseName)
{

    ifstream titlesFile(baseName + "_titles.txt");
    ifstream graphFile(baseName + "_graph.bin", ios::binary);
    ifstream weightFile(baseName + "_weights.bin", ios::binary);

    if (!titlesFile.is_open() || !graphFile.is_open() || !weightFile.is_open())
    {

        cout << "Error: could not open files" << endl;
        return;
    }

    id_to_index.clear();
    index_to_id.clear();
    graph.clear();
    weight.clear();

    int numTitles;
    titlesFile >> numTitles;
    titlesFile.ignore();

    for (int i = 0; i < numTitles; i++)
    {

        string title;
        getline(titlesFile, title);
        index_to_id.push_back(title);
        id_to_index[title] = i;
    }

    int numNodes;
    graphFile.read(reinterpret_cast<char *>(&numNodes), sizeof(int));
    graph.resize(numNodes);

    for (int i = 0; i < numNodes; i++)
    {

        int curSize = 0;
        graphFile.read(reinterpret_cast<char *>(&curSize), sizeof(int));

        graph[i].resize(curSize);

        if (curSize > 0)
        {
            graphFile.read(reinterpret_cast<char *>(graph[i].data()), curSize * sizeof(int));
        }
    }

    int weightSize;
    weightFile.read(reinterpret_cast<char *>(&weightSize), sizeof(int));

    weight.resize(weightSize);

    if (weightSize > 0)
    {
        weightFile.read(reinterpret_cast<char *>(weight.data()), weightSize * sizeof(int));
    }

    cout << "Loaded graph files" << endl;
}