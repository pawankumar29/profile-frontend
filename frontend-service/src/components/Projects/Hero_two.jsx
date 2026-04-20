import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PROFILE_API_BASE, profileHttp, withProfileAuth } from '../../lib/api'
import { getStoredAuthToken, storeAuthSession } from '../../lib/auth'
import { fetchCategories } from '../../store/slices/categorySlice'

function Hero_two() {
  const dispatch = useDispatch()
  const { list, loading, error } = useSelector((state) => state.category)
  const [selectedCategoryId, setSelectedCategoryId] = useState("all")
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [projectsError, setProjectsError] = useState(null)

  useEffect(() => {
    let isMounted = true;

    const loadCategories = () => {
      // If we already have a token, just fetch
      if (getStoredAuthToken()) {
        if (isMounted && list.length === 0) {
          dispatch(fetchCategories());
        }
      } else {
        // Otherwise wait for the global session to be ready
        const onSessionReady = () => {
          if (isMounted && list.length === 0) {
            dispatch(fetchCategories());
          }
          window.removeEventListener('session-ready', onSessionReady);
        };
        window.addEventListener('session-ready', onSessionReady);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
      window.removeEventListener('session-ready', loadCategories);
    };
  }, [dispatch, list.length]);

  const categories = [
    { id: 'all', type: 'All' },
    ...list,
  ]

  const categoryById = useMemo(() => {
    const map = new Map()
    for (const c of list) map.set(String(c.id), c)
    return map
  }, [list])

  const loadProjects = async (categoryId) => {
    setProjectsError(null)
    setProjectsLoading(true)
    try {
      if (categoryId === "all") {
        const res = await profileHttp.get("/api/getAllProject")
        setProjects(res.data || [])
      } else {
        const res = await profileHttp.get("/api/getProject", {
          params: { category: categoryId },
        })
        setProjects(res.data || [])
      }
    } catch (err) {
      console.error("Failed to load projects", err)
      setProjectsError("Failed to load projects")
      setProjects([])
    } finally {
      setProjectsLoading(false)
    }
  }

  useEffect(() => {
    // only load projects once we have a list of categories (which means auth is ready)
    // or if we're on the initial mount and list might be empty but we want to try anyway
    if (list.length > 0 || !loading) {
       loadProjects("all")
    }
  }, [list.length, loading])

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              const nextId = String(category.id)
              setSelectedCategoryId(nextId)
              loadProjects(nextId)
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
        <p className="text-center text-sm text-muted-foreground">Loading categories...</p>
      ) : null}

      {!loading && error ? (
        <p className="text-center text-sm text-red-400">Failed to load categories.</p>
      ) : null}

      {projectsLoading ? (
        <p className="text-center text-sm text-muted-foreground">Loading projects...</p>
      ) : null}

      {!projectsLoading && projectsError ? (
        <p className="text-center text-sm text-red-400">{projectsError}</p>
      ) : null}

      {!projectsLoading && !projectsError ? (
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const category = categoryById.get(String(project.projectCategoryId))
              return (
                <div
                  key={project.id}
                  className="glass rounded-2xl overflow-hidden border border-border/50 hover:border-border transition-colors"
                >
                  <div className="aspect-[16/9] bg-card/30">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.brandName || "Project"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-lg font-semibold text-foreground truncate">
                        {project.brandName || "Untitled"}
                      </h3>
                      <span className="text-xs font-medium text-primary">
                        {category?.type || "Other"}
                      </span>
                    </div>

                    {project.blog ? (
                      <p className="mt-3 text-sm text-muted-foreground overflow-hidden text-ellipsis max-h-16">
                        {project.blog}
                      </p>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>

          {!projects.length ? (
            <p className="text-center text-sm text-muted-foreground mt-10">
              No projects found.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default Hero_two;
