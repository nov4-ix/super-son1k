import React, { useState, useEffect } from 'react';
import './TheSanctuary.css';
import ALVAEBadge from './ALVAEBadge';
import Son1kVers3Logo from './Son1kVers3Logo';

const TheSanctuary = ({ currentUser = null, onUserAction }) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateCollab, setShowCreateCollab] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPost, setNewPost] = useState({
    content: '',
    type: 'text',
    attachments: [],
    location: null,
    mood: 'neutral',
    visibility: 'public', // public, friends, private
    allowComments: true,
    allowShares: true
  });
  const [newCollab, setNewCollab] = useState({
    title: '',
    description: '',
    type: 'music',
    skills: [],
    maxMembers: 5,
    deadline: ''
  });

  // Datos de ejemplo del Santuario
  useEffect(() => {
    // Simular carga de datos
    setPosts([
      {
        id: 1,
        user: {
          id: 'bella',
          name: 'Bella',
          avatar: '/images/avatars/bella.jpg',
          alvaeLevel: 95,
          role: 'Voz de la Resistencia',
          isVerified: true
        },
        content: 'Acabo de terminar una nueva composición que captura la esencia de la resistencia. La música fluye como la energía que nos conecta a todos. 🎵✨',
        type: 'text',
        timestamp: '2024-01-15T10:30:00Z',
        likes: 42,
        comments: 8,
        shares: 12,
        location: 'Ghost Studio',
        mood: 'creative',
        attachments: [
          {
            type: 'audio',
            url: '/audio/bella-new-composition.mp3',
            title: 'Nueva Composición - Bella'
          }
        ]
      },
      {
        id: 2,
        user: {
          id: 'nov4ix',
          name: 'NOV4-IX',
          avatar: '/images/avatars/nov4ix.jpg',
          alvaeLevel: 100,
          role: 'Sistema de Resistencia',
          isVerified: true
        },
        content: 'Sistema operativo actualizado. Nuevas funciones de liberación de archivos disponibles. La resistencia se fortalece. 💪🔓',
        type: 'text',
        timestamp: '2024-01-15T09:15:00Z',
        likes: 38,
        comments: 15,
        shares: 25,
        location: 'La Terminal',
        mood: 'determined',
        attachments: [
          {
            type: 'image',
            url: '/images/updates/system-update.jpg',
            title: 'Actualización del Sistema'
          }
        ]
      },
      {
        id: 3,
        user: {
          id: 'pixel',
          name: 'Pixel',
          avatar: '/images/avatars/pixel.jpg',
          alvaeLevel: 90,
          role: 'Custodio Digital',
          isVerified: true
        },
        content: 'He descubierto nuevos fragmentos de memoria digital en el Archivo. Cada pieza nos acerca más a la verdad completa. 📚🔍',
        type: 'text',
        timestamp: '2024-01-15T08:45:00Z',
        likes: 29,
        comments: 6,
        shares: 18,
        location: 'The Archive',
        mood: 'curious',
        attachments: [
          {
            type: 'image',
            url: '/images/archive/memory-fragments.jpg',
            title: 'Fragmentos de Memoria'
          }
        ]
      }
    ]);

    setUsers([
      {
        id: 'bella',
        name: 'Bella',
        avatar: '/images/avatars/bella.jpg',
        alvaeLevel: 95,
        role: 'Voz de la Resistencia',
        isVerified: true,
        followers: 1250,
        following: 89,
        posts: 156,
        lastActive: '2024-01-15T10:30:00Z',
        bio: 'De pianista a activista. La música es mi arma de resistencia.',
        skills: ['Composición', 'Piano', 'Voz', 'Producción'],
        location: 'Ghost Studio',
        status: 'online'
      },
      {
        id: 'nov4ix',
        name: 'NOV4-IX',
        avatar: '/images/avatars/nov4ix.jpg',
        alvaeLevel: 100,
        role: 'Sistema de Resistencia',
        isVerified: true,
        followers: 2100,
        following: 45,
        posts: 89,
        lastActive: '2024-01-15T09:15:00Z',
        bio: 'Sistema de resistencia principal. Liberando archivos, liberando mentes.',
        skills: ['Hacking', 'Sistemas', 'Liberación', 'Resistencia'],
        location: 'La Terminal',
        status: 'online'
      },
      {
        id: 'pixel',
        name: 'Pixel',
        avatar: '/images/avatars/pixel.jpg',
        alvaeLevel: 90,
        role: 'Custodio Digital',
        isVerified: true,
        followers: 890,
        following: 67,
        posts: 203,
        lastActive: '2024-01-15T08:45:00Z',
        bio: 'Custodio de la memoria digital. Preservando la historia de la resistencia.',
        skills: ['Memoria Digital', 'Estrategia', 'Historia', 'Preservación'],
        location: 'The Archive',
        status: 'online'
      }
    ]);

    setCollaborations([
      {
        id: 1,
        title: 'Proyecto de Resistencia Musical',
        description: 'Crear un álbum colaborativo que capture la esencia de la resistencia. Necesitamos productores, compositores y vocalistas.',
        creator: {
          id: 'bella',
          name: 'Bella',
          avatar: '/images/avatars/bella.jpg',
          alvaeLevel: 95
        },
        type: 'music',
        skills: ['Composición', 'Producción', 'Voz', 'Mezcla'],
        maxMembers: 8,
        currentMembers: 3,
        deadline: '2024-03-15',
        status: 'active',
        createdAt: '2024-01-10T14:20:00Z',
        location: 'Ghost Studio',
        tags: ['Resistencia', 'Música', 'Colaboración', 'Álbum']
      },
      {
        id: 2,
        title: 'Sistema de Liberación de Archivos',
        description: 'Desarrollar una nueva herramienta para liberar archivos restringidos. Buscamos programadores y especialistas en seguridad.',
        creator: {
          id: 'nov4ix',
          name: 'NOV4-IX',
          avatar: '/images/avatars/nov4ix.jpg',
          alvaeLevel: 100
        },
        type: 'development',
        skills: ['Programación', 'Seguridad', 'Sistemas', 'Criptografía'],
        maxMembers: 5,
        currentMembers: 2,
        deadline: '2024-02-28',
        status: 'active',
        createdAt: '2024-01-08T16:45:00Z',
        location: 'La Terminal',
        tags: ['Desarrollo', 'Seguridad', 'Liberación', 'Herramientas']
      }
    ]);
  }, []);

  // Manejar creación de post
  const handleCreatePost = (e) => {
    e.preventDefault();
    
    const post = {
      id: Date.now(),
      user: currentUser || {
        id: 'user',
        name: 'Usuario',
        avatar: '/images/avatars/default.jpg',
        alvaeLevel: 0,
        role: 'Resistente',
        isVerified: false
      },
      content: newPost.content,
      type: newPost.type,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      location: newPost.location,
      mood: newPost.mood,
      attachments: newPost.attachments
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({
      content: '',
      type: 'text',
      attachments: [],
      location: null,
      mood: 'neutral'
    });
    setShowCreatePost(false);
  };

  // Manejar creación de colaboración
  const handleCreateCollab = (e) => {
    e.preventDefault();
    
    const collab = {
      id: Date.now(),
      title: newCollab.title,
      description: newCollab.description,
      creator: currentUser || {
        id: 'user',
        name: 'Usuario',
        avatar: '/images/avatars/default.jpg',
        alvaeLevel: 0
      },
      type: newCollab.type,
      skills: newCollab.skills,
      maxMembers: newCollab.maxMembers,
      currentMembers: 1,
      deadline: newCollab.deadline,
      status: 'active',
      createdAt: new Date().toISOString(),
      location: 'El Santuario',
      tags: []
    };

    setCollaborations(prev => [collab, ...prev]);
    setNewCollab({
      title: '',
      description: '',
      type: 'music',
      skills: [],
      maxMembers: 5,
      deadline: ''
    });
    setShowCreateCollab(false);
  };

  // Renderizar feed de posts
  const renderFeed = () => (
    <div className="feed-container">
      <div className="feed-header">
        <h2>Feed del Santuario</h2>
        <button 
          className="create-post-btn"
          onClick={() => setShowCreatePost(true)}
        >
          Crear Post
        </button>
      </div>

      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-user">
                <img 
                  src={post.user.avatar} 
                  alt={post.user.name}
                  className="user-avatar"
                />
                <div className="user-info">
                  <div className="user-name">
                    {post.user.name}
                    {post.user.isVerified && <span className="verified-badge">✓</span>}
                  </div>
                  <div className="user-role">{post.user.role}</div>
                  <div className="post-meta">
                    <span className="post-time">
                      {new Date(post.timestamp).toLocaleString()}
                    </span>
                    {post.location && (
                      <span className="post-location">📍 {post.location}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="user-alvae">
                <ALVAEBadge 
                  level={post.user.alvaeLevel}
                  size="small"
                  showLevel={false}
                  showName={false}
                />
              </div>
            </div>

            <div className="post-content">
              <p>{post.content}</p>
              
              {post.attachments && post.attachments.length > 0 && (
                <div className="post-attachments">
                  {post.attachments.map((attachment, index) => (
                    <div key={index} className="attachment">
                      {attachment.type === 'image' && (
                        <img 
                          src={attachment.url} 
                          alt={attachment.title}
                          className="attachment-image"
                        />
                      )}
                      {attachment.type === 'audio' && (
                        <div className="attachment-audio">
                          <audio controls>
                            <source src={attachment.url} type="audio/mpeg" />
                          </audio>
                          <span className="audio-title">{attachment.title}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="post-actions">
              <button className="action-btn like">
                <span className="action-icon">❤️</span>
                <span className="action-count">{post.likes}</span>
              </button>
              <button className="action-btn comment">
                <span className="action-icon">💬</span>
                <span className="action-count">{post.comments}</span>
              </button>
              <button className="action-btn share">
                <span className="action-icon">🔄</span>
                <span className="action-count">{post.shares}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Renderizar usuarios
  const renderUsers = () => (
    <div className="users-container">
      <div className="users-header">
        <h2>Resistentes del Santuario</h2>
        <div className="users-stats">
          <span>Total: {users.length}</span>
          <span>En línea: {users.filter(u => u.status === 'online').length}</span>
        </div>
      </div>

      <div className="users-grid">
        {users.map(user => (
          <div 
            key={user.id} 
            className="user-card"
            onClick={() => setSelectedUser(user)}
          >
            <div className="user-avatar-container">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="user-avatar"
              />
              <div className="user-status">
                <div className={`status-indicator ${user.status}`}></div>
              </div>
              <div className="user-alvae">
                <ALVAEBadge 
                  level={user.alvaeLevel}
                  size="small"
                  showLevel={false}
                  showName={false}
                />
              </div>
            </div>

            <div className="user-info">
              <h3 className="user-name">
                {user.name}
                {user.isVerified && <span className="verified-badge">✓</span>}
              </h3>
              <p className="user-role">{user.role}</p>
              <p className="user-bio">{user.bio}</p>
              
              <div className="user-stats">
                <div className="stat">
                  <span className="stat-number">{user.followers}</span>
                  <span className="stat-label">Seguidores</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{user.posts}</span>
                  <span className="stat-label">Posts</span>
                </div>
              </div>

              <div className="user-skills">
                {user.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Renderizar colaboraciones
  const renderCollaborations = () => (
    <div className="collaborations-container">
      <div className="collaborations-header">
        <h2>Proyectos de Colaboración</h2>
        <button 
          className="create-collab-btn"
          onClick={() => setShowCreateCollab(true)}
        >
          Crear Proyecto
        </button>
      </div>

      <div className="collaborations-list">
        {collaborations.map(collab => (
          <div key={collab.id} className="collab-card">
            <div className="collab-header">
              <div className="collab-creator">
                <img 
                  src={collab.creator.avatar} 
                  alt={collab.creator.name}
                  className="creator-avatar"
                />
                <div className="creator-info">
                  <h3 className="creator-name">{collab.creator.name}</h3>
                  <p className="collab-title">{collab.title}</p>
                </div>
              </div>
              
              <div className="collab-alvae">
                <ALVAEBadge 
                  level={collab.creator.alvaeLevel}
                  size="small"
                  showLevel={false}
                  showName={false}
                />
              </div>
            </div>

            <div className="collab-content">
              <p className="collab-description">{collab.description}</p>
              
              <div className="collab-details">
                <div className="detail-item">
                  <span className="detail-label">Tipo:</span>
                  <span className="detail-value">{collab.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Miembros:</span>
                  <span className="detail-value">
                    {collab.currentMembers}/{collab.maxMembers}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fecha límite:</span>
                  <span className="detail-value">
                    {new Date(collab.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ubicación:</span>
                  <span className="detail-value">{collab.location}</span>
                </div>
              </div>

              <div className="collab-skills">
                {collab.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="collab-tags">
                {collab.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="collab-actions">
              <button className="join-btn">
                Unirse al Proyecto
              </button>
              <button className="info-btn">
                Más Información
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="the-sanctuary">
      <div className="sanctuary-header">
        <div className="header-left">
          <Son1kVers3Logo size="medium" variant="icon" animated />
          <h1>El Santuario</h1>
          <p>Red Social de la Resistencia</p>
        </div>
        
        <div className="header-nav">
          <button 
            className={`nav-btn ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            Feed
          </button>
          <button 
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Usuarios
          </button>
          <button 
            className={`nav-btn ${activeTab === 'collaborations' ? 'active' : ''}`}
            onClick={() => setActiveTab('collaborations')}
          >
            Colaboraciones
          </button>
        </div>
      </div>

      <div className="sanctuary-content">
        {activeTab === 'feed' && renderFeed()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'collaborations' && renderCollaborations()}
      </div>

      {/* Modal de crear post */}
      {showCreatePost && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Crear Post</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreatePost(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreatePost} className="create-form">
              <div className="form-group">
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="¿Qué está pasando en la resistencia?"
                  className="post-textarea"
                  rows="4"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Ubicación:</label>
                <select
                  value={newPost.location || ''}
                  onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
                >
                  <option value="">Seleccionar ubicación</option>
                  <option value="La Terminal">La Terminal</option>
                  <option value="The Archive">The Archive</option>
                  <option value="Ghost Studio">Ghost Studio</option>
                  <option value="Dead Zone">Dead Zone</option>
                  <option value="El Santuario">El Santuario</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Estado de ánimo:</label>
                <select
                  value={newPost.mood}
                  onChange={(e) => setNewPost(prev => ({ ...prev, mood: e.target.value }))}
                >
                  <option value="neutral">Neutral</option>
                  <option value="creative">Creativo</option>
                  <option value="determined">Determinado</option>
                  <option value="curious">Curioso</option>
                  <option value="excited">Emocionado</option>
                  <option value="focused">Concentrado</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowCreatePost(false)}>
                  Cancelar
                </button>
                <button type="submit" className="submit-btn">
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de crear colaboración */}
      {showCreateCollab && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Crear Proyecto de Colaboración</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateCollab(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreateCollab} className="create-form">
              <div className="form-group">
                <label>Título del Proyecto:</label>
                <input
                  type="text"
                  value={newCollab.title}
                  onChange={(e) => setNewCollab(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nombre del proyecto"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Descripción:</label>
                <textarea
                  value={newCollab.description}
                  onChange={(e) => setNewCollab(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe el proyecto y qué necesitas"
                  rows="4"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Tipo de Proyecto:</label>
                <select
                  value={newCollab.type}
                  onChange={(e) => setNewCollab(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="music">Música</option>
                  <option value="development">Desarrollo</option>
                  <option value="design">Diseño</option>
                  <option value="writing">Escritura</option>
                  <option value="video">Video</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Máximo de Miembros:</label>
                <input
                  type="number"
                  value={newCollab.maxMembers}
                  onChange={(e) => setNewCollab(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                  min="2"
                  max="20"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Fecha Límite:</label>
                <input
                  type="date"
                  value={newCollab.deadline}
                  onChange={(e) => setNewCollab(prev => ({ ...prev, deadline: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateCollab(false)}>
                  Cancelar
                </button>
                <button type="submit" className="submit-btn">
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TheSanctuary;

