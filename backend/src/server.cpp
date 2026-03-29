// Created by Daniel on 3/23/2026.

#include "algos.h"
#include "graph.h"
#include <crow.h>

#include <random>
#include <chrono>

using namespace std;

const int INF = 1e9;

pair<int, int> getRandomValidPair(Graph &g)
{

    random_device rd;
    mt19937 gen(rd());
    uniform_int_distribution<> dist(0, g.graph.size() - 1);

    while (true)
    {

        int start = dist(gen);
        int end = dist(gen);

        if (start == end)
            continue;

        auto path = dijkstra(g, start, end);

        if (!path.empty())
        {
            return {start, end};
        }
    }
}

int main()
{

    Graph g;

    string baseName = "backend/data/wiki_graph";
    g.loadBinary(baseName);

    if (g.graph.empty())
    {
        cerr << "Can't open graph" << endl;
        return 1;
    }

    crow::SimpleApp app;

    CROW_ROUTE(app, "/path")([&g]()
                             {
                                 auto [start, end] = getRandomValidPair(g);

                                 auto t1 = std::chrono::high_resolution_clock::now();
                                 auto dijkstraPath = dijkstra(g, start, end);
                                 auto t2 = std::chrono::high_resolution_clock::now();

                                 auto t3 = std::chrono::high_resolution_clock::now();
                                 auto dialPath = dial(g, start, end);
                                 auto t4 = std::chrono::high_resolution_clock::now();

                                 crow::json::wvalue res;

                                 res["start"] = g.getName(start);
                                 res["end"] = g.getName(end);

                                 for (int i = 0; i < dijkstraPath.size(); ++i)
                                 {
                                     res["bfs"][i] = g.getName(dijkstraPath[i]);
                                 }

                                 res["dijkstra_time"] = std::chrono::duration<double, std::milli>(t2 - t1).count();

                                 for (int i = 0; i < dialPath.size(); ++i)
                                 {
                                     res["dial"][i] = g.getName(dialPath[i]);
                                 }

                                 res["dial_time"] = std::chrono::duration<double, std::milli>(t4 - t3).count();

                                 crow::response resp{res};
                                 resp.add_header("Access-Control-Allow-Origin", "*");
                                 return resp;
                             });

    CROW_ROUTE(app, "/neighbors")([&g](const crow::request& req)
                                  {
                                      std::string page = req.url_params.get("page") ? req.url_params.get("page") : "";

                                      crow::json::wvalue res;

                                      if (page.empty() || !g.id_to_index.count(page))
                                      {
                                          res["error"] = "page not found";
                                          crow::response resp{400, res};
                                          resp.add_header("Access-Control-Allow-Origin", "*");
                                          return resp;
                                      }

                                      int idx = g.id_to_index[page];
                                      auto& neighborIndices = g.graph[idx];

                                      res["neighbors"] = crow::json::wvalue::list();
                                      int count = 0;
                                      for (int i = 0; i < (int)neighborIndices.size(); ++i)
                                      {
                                          int nIdx = neighborIndices[i];
                                          if (nIdx < (int)g.graph.size() && !g.graph[nIdx].empty())
                                          {
                                              res["neighbors"][count] = g.getName(nIdx);
                                              count++;
                                          }
                                      }

                                      crow::response resp{res};
                                      resp.add_header("Access-Control-Allow-Origin", "*");
                                      return resp;
                                  });

    app.port(18080).multithreaded().run();
}
