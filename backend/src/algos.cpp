#include <vector>
#include <queue>
#include <algorithm>
#include "algos.h"

const int INF = 1e9;

std::vector<int> dijkstra(Graph &g, int start, int target)
{
    return dijkstra(g.graph, g.weight, start, target);
}

std::vector<int> dial(Graph &g, int start, int target)
{
    int maxWeight = 0;
    for (int w : g.weight)
        maxWeight = std::max(maxWeight, w);
    if (maxWeight < 1)
        maxWeight = 1;
    return dial(g.graph, g.weight, start, target, maxWeight);
}

// https://cp-algorithms.com/graph/dijkstra.html
std::vector<int> dijkstra(
    std::vector<std::vector<int>> &graph,
    std::vector<int> &weight,
    int start,
    int target)
{
    int n = graph.size();
    std::vector<int> dist(n, INF);
    std::vector<int> parent(n, -1);
    std::priority_queue<
        std::pair<int, int>,
        std::vector<std::pair<int, int>>,
        std::greater<std::pair<int, int>>>
        pq;

    dist[start] = 0;
    pq.push({0, start});

    while (!pq.empty())
    {
        auto [distance, u] = pq.top();
        pq.pop();

        if (distance > dist[u])
        {
            continue;
        }
        if (u == target)
        {
            break;
        }

        for (auto &v : graph[u])
        {
            int newDist = dist[u] + weight[v];
            if (newDist < dist[v])
            {
                dist[v] = newDist;
                parent[v] = u;
                pq.push({dist[v], v});
            }
        }
    }

    // no path exists
    if (dist[target] == INF)
    {
        return std::vector<int>();
    }

    // reconstruct path
    std::vector<int> path;
    for (int v = target; v != -1; v = parent[v])
    {
        path.push_back(v);
    }
    std::reverse(path.begin(), path.end());
    return path;
}

// https://www.geeksforgeeks.org/dsa/dials-algorithm-optimized-dijkstra-for-small-range-weights/
std::vector<int> dial(
    std::vector<std::vector<int>> &graph,
    std::vector<int> &weight,
    int start,
    int target,
    int maxWeight)
{
    int n = graph.size();
    std::vector<int> dist(n, INF);
    dist[start] = 0;
    std::vector<int> parent(n, -1);

    int maxDist = (n - 1) * maxWeight;
    std::vector<std::vector<int>> buckets(maxDist + 1);
    buckets[0].push_back(start);

    bool found = false;
    for (int d = 0; d <= maxDist; d++)
    {
        if (found)
            break;

        while (buckets[d].size())
        {
            int u = buckets[d].back();
            buckets[d].pop_back();

            if (d > dist[u])
            {
                continue;
            }
            if (u == target)
            {
                found = true;
                break;
            }

            for (auto &v : graph[u])
            {
                int newDist = dist[u] + weight[v];
                if (newDist < dist[v])
                {
                    dist[v] = newDist;
                    parent[v] = u;
                    buckets[newDist].push_back(v);
                }
            }
        }
    }
    // no path exists
    if (dist[target] == INF)
        return {};

    // reconstruct path
    std::vector<int> path;
    for (int v = target; v != -1; v = parent[v])
    {
        path.push_back(v);
    }
    std::reverse(path.begin(), path.end());
    return path;
}