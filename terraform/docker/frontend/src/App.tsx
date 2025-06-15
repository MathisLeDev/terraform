import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  X,
  Save
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Task {
  id: number;
  title: string;
  created_at: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`);
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTaskTitle.trim()
        }),
      });

      if (response.ok) {
        setNewTaskTitle('');
        setShowAddForm(false);
        await fetchTasks();
      } else {
        console.error('Erreur lors de la création de la tâche');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <CheckSquare className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
              </div>
              <div className="text-sm text-gray-500">
                Gestionnaire de tâches simple
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckSquare className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Total des tâches</p>
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                </div>
              </div>
              <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Nouvelle tâche</span>
              </button>
            </div>
          </div>

          <div className="card mb-8">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                  type="text"
                  placeholder="Rechercher une tâche..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredTasks.map((task) => (
                <div key={task.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                      <p className="text-sm text-gray-500">
                        Créée le {new Date(task.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      </p>
                    </div>
                    <CheckSquare className="w-6 h-6 text-green-500" />
                  </div>
                </div>
            ))}

            {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                  <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune tâche trouvée</h3>
                  <p className="text-gray-500">
                    {searchTerm
                        ? 'Essayez de modifier votre recherche'
                        : 'Commencez par créer votre première tâche'
                    }
                  </p>
                </div>
            )}
          </div>
        </div>

        {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Nouvelle tâche</h2>
                  <button
                      onClick={() => setShowAddForm(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmitTask} className="p-6">
                  <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de la tâche *
                    </label>
                    <input
                        type="text"
                        id="title"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Que devez-vous faire ?"
                        autoFocus
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="btn-secondary"
                        disabled={isSubmitting}
                    >
                      Annuler
                    </button>
                    <button
                        type="submit"
                        className="btn-primary flex items-center space-x-2"
                        disabled={isSubmitting || !newTaskTitle.trim()}
                    >
                      {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Création...</span>
                          </>
                      ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Créer</span>
                          </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-500">
              Infrastructure déployée avec Terraform + Docker
            </div>
          </div>
        </footer>
      </div>
  );
}

export default App;