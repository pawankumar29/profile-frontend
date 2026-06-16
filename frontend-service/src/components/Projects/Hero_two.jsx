import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PROFILE_API_BASE, profileHttp, withProfileAuth } from "../../lib/api";
import { fetchCategories } from "../../store/slices/categorySlice";

function Hero_two() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.category);
  const { isInitialized } = useSelector((state) => state.user);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState({});

  // 1. Initial Load: Sequence categories and then projects
  useEffect(() => {
    if (!isInitialized) return;

    const initData = async () => {
      // Fetch categories if they aren't loaded yet
      if (list.length === 0) {
        await dispatch(fetchCategories());
      }
      // Initial projects load
      loadProjects("all");
    };

    initData();
  }, [dispatch, isInitialized, list.length]);

  const categories = useMemo(
    () => [{ id: "all", type: "All" }, ...list],
    [list],
  );

  const categoryById = useMemo(() => {
    const map = new Map();
    for (const c of list) map.set(String(c.id), c);
    return map;
  }, [list]);

  const loadProjects = async (categoryId) => {
    if (!isInitialized) return; // Guard clause

    setProjectsError(null);
    setProjectsLoading(true);
    try {
      if (categoryId === "all") {
        const res = await profileHttp.get("/api/getAllProject");
        setProjects(res.data || []);
      } else {
        const res = await profileHttp.get("/api/getProject", {
          params: { category: categoryId },
        });
        setProjects(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
      setProjectsError("Failed to load projects");
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  const toggleExpandProject = (projectId) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              const nextId = String(category.id);
              setSelectedCategoryId(nextId);
              loadProjects(nextId);
            }}
            className={[
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              selectedCategoryId === String(category.id)
                ? "gradient-bg text-primary-foreground"
                : "glass text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {category.type}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-sm text-muted-foreground">
          Loading categories...
        </p>
      ) : null}

      {!loading && error ? (
        <p className="text-center text-sm text-red-400">
          Failed to load categories.
        </p>
      ) : null}

      {projectsLoading ? (
        <p className="text-center text-sm text-muted-foreground">
          Loading projects...
        </p>
      ) : null}

      {!projectsLoading && projectsError ? (
        <p className="text-center text-sm text-red-400">{projectsError}</p>
      ) : null}

      {!projectsLoading && !projectsError ? (
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const category = categoryById.get(
                String(project.projectCategoryId),
              );
              return (
                <div
                  key={project.id}
                  className="glass rounded-2xl border border-border/50 hover:border-border transition-all hover:shadow-lg cursor-pointer flex flex-col"
                  onClick={() => {
                    if (project.projectLink) {
                      window.open(project.projectLink, "_blank");
                    }
                  }}
                >
                  <div className="aspect-[16/9] bg-card/30 relative overflow-hidden group">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.brandName || "Project"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-gradient-to-br from-card/50 to-card/20">
                        No image available
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Project Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display text-lg font-semibold text-foreground break-words flex-1">
                        {project.brandName || "Untitled Project"}
                      </h3>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full gradient-bg text-primary-foreground whitespace-nowrap">
                        {category?.type || "Other"}
                      </span>
                    </div>

                    {/* Project ID */}
                    {/* <p className="text-xs text-muted-foreground mb-3">
                      ID: {project.id}
                    </p> */}

                    {/* Full Description */}
                    {project.blog ? (
                      <div className="mb-4 flex-1">
                        <p
                          className={`text-sm text-muted-foreground leading-relaxed transition-all ${
                            expandedProjects[project.id] ? "" : "line-clamp-3"
                          }`}
                        >
                          {project.blog}
                        </p>
                        {project.blog.length > 150 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpandProject(project.id);
                            }}
                            className="mt-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            {expandedProjects[project.id]
                              ? "Read Less ↑"
                              : "Read More ↓"}
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground/50 mb-4 italic flex-1">
                        No description available
                      </p>
                    )}

                    {/* Skills Section */}
                    {project.skills ? (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-foreground/80 mb-2">
                          Technologies:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            const raw = project.skills;
                            let skillsArr = [];
                            if (Array.isArray(raw)) skillsArr = raw;
                            else if (typeof raw === "string") {
                              try {
                                const parsed = JSON.parse(raw);
                                if (Array.isArray(parsed)) skillsArr = parsed;
                              } catch {}
                            }
                            return skillsArr.slice(0, 6).map((skill) => (
                              <span
                                key={skill}
                                className="px-2.5 py-1 rounded-md text-[11px] font-medium glass text-foreground/80 border border-border/50 hover:border-primary/50 transition-colors"
                              >
                                {skill}
                              </span>
                            ));
                          })()}
                        </div>
                      </div>
                    ) : null}

                    {/* Additional Info Footer */}
                    <div className="mt-4 pt-4 border-t border-border/30 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Category: {category?.type || "Uncategorized"}
                      </span>
                      <a
                        href={project.projectLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        View More →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!projects.length ? (
            <p className="text-center text-sm text-muted-foreground mt-10">
              No projects found in this category.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default Hero_two;
