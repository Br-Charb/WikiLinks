// Created by Daniel on 3/28/2026.

#include <vector>
#include "graph.h"

using namespace std;

vector<int> dijkstra(vector<vector<int>> &graph, vector<int> &weight, int start, int target);
vector<int> dial(vector<vector<int>> &graph, vector<int> &weight, int start, int target, int maxWeight);

vector<int> dijkstra(Graph &g, int start, int target);
vector<int> dial(Graph &g, int start, int target);
