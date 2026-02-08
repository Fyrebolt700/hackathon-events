import { useState, useEffect } from 'react'

function App() {
  const [events, setEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [search, setSearch] = useState("");

  // Handle user login using hardcoded credentials
  const handleLogin = () => 
  {
    if(username === "hacker" && password === "htn2026")
    {
      setIsLoggedIn(true);
    }
    else 
    {
      alert("wrong username or password!")
    }
  }
  
  //Fetch events from API anf sort by start time
  useEffect(() => {
    fetch('https://api.hackthenorth.com/v3/events')
      .then(response => response.json())
      .then(data => {
        const sortedEvents = data.sort((a, b) => a.start_time - b.start_time);
        setEvents(sortedEvents);
      });
  }, []);
  
// Main app container with centered layout
 return (
    <div
      style={{
        //padding:'20px',
        width: '100%',
        minHeight: '100vh',
        // boxSizing: 'border-box',
        // alignSelf: 'stretch',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#3d464f',
        overflowX: 'hidden'
      }}
    >
    {/* Navigation banner */}
      <div
        style={{
          backgroundColor: '#cccfcf',
          padding: '10px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'fixed',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000
        }}
      >
        <h2
          onClick={() => setSelectedEvent(null)}
          style={{
            color: 'white',
            margin: 0,
            cursor: 'pointer',
            fontWeight: '600',
            letterSpacing: '0.5px',
          }}
        >
          Hackathon Global Inc.
        </h2>
        <div
          style={{
            position: 'relative'
          }}
        >
          <button
            aria-label="User login menu"
            onClick ={() =>
              setShowLoginDropdown(!showLoginDropdown)
            }
            style={{
              backgroundColor: 'transparent'
            }}
          >
            👤
          </button>
          
          {/* Login/Logout dropdown menu */}
          {showLoginDropdown &&(
            <div
              style={{
                position:'fixed',
                top: '60px',
                right:'30px',
                backgroundColor: '#1c354d',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '20px',
                minWidth: '250px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                zIndex: 1000
              }}
          >
            {!isLoggedIn && (
              <div>
                <h3
                  style={{ margin: 0}}
                >
                  Login
                </h3>
                <input
                  type='text'
                  placeholder="Username"
                  aria-label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '5px',
                    marginBottom: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
                <input
                  type = 'password'
                  placeholder = 'Password'
                  aria-label= "Password"
                  value = {password}
                  onChange = {(e) => setPassword(e.target.value)}
                  style ={{
                    width: '100%',
                    padding: '5px',
                    marginBottom: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
                <button
                  aria-label="Login"
                  onClick={() => {
                    handleLogin();
                    if (username === 'hacker' && password === 'htn2026') {
                      setShowLoginDropdown(false);
                    }
                  }}
                  style={{
                    width: '50%',
                    padding: '10px',
                    cursor: 'pointer',
                    backgroundColor: '#0c0c0d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Login
                </button>
              </div>
            )}

            {isLoggedIn && (
              <div>
                <p style={{ marginTop: 0 }}>
                  Logged in as <strong> hacker </strong>
                </p>
                <button
                  aria-label="Logout"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setShowLoginDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#0c0c0d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                    Logout
                </button>
              </div>
            )}
          </div>
          )}
        </div>
      </div>

      {/* Main page title - only shown on event list view */}
      {!selectedEvent && (
        <h1
          style={{
            marginTop: '80px',
            padding: '10px',
            textAlign: 'center',
            color: 'white'
          }}
        >
          Hackathon Events
        </h1>
      )}

      {/* Event list with search and filtering */}
      {!selectedEvent && (
        <div
          style = {{
            padding: '0 15px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '1100px',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <input
              placeholder="Search events"
              aria-label="Search events"
              value={search}
              onChange={e=> setSearch(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '900px',
                padding: '12px 15px',
                borderRadius: '8px',
                border: '2px solid #333',
                fontSize: '1rem',
              }}
            />
          </div>
          {/* Filter events by permission and search query */}
          {events
          .filter(event => {
            const canView= isLoggedIn || event.permission === 'public';
            const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase())

            return canView && matchesSearch;
          })
          .map((event) => (
            <div 
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              style={{
                border:'2px solid #333',
                padding: '15px',
                cursor: 'pointer',
                borderRadius: '8px',
                width: '100%',
                //marginBottom: '20px',
                maxWidth: '900px',
                boxSizing: 'border-box',
                backgroundColor: '#8cc6ff',
                margin: '10px',
                textAlign: 'center',
                color: 'white',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              
            >
              <strong>
                {event.name}
              </strong>
              <div
                style={{
                  fontSize: '0.85rem',
                  opacity: '0.8',
                  marginTop:'5px'
                }}
              >
                {new Date(event.start_time).toLocaleString()}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Event detail view */}
      {selectedEvent && (
        <div
          style={{
            paddingTop: '60px',
            padding: '60px 10px 20px 10px',
            width: '100%',
            flexDirection: 'column',
            backgroundColor: '#3d464f',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '900px'
            }}
          >
            <button
              aria-label="Back to All Events"
              onClick={() => setSelectedEvent(null)}
              style={{
                border: '2px solid #333',
                borderRadius: '6px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontWeight: 500,
                backgroundColor: '#8cc6ff'
              }}
            >
             ← Back to All Events
            </button>
          </div>
          <div
            style={{
              border: '2px solid #333',
              padding: '20px',
              marginTop: '20px',
              borderRadius: '8px',
              boxSizing: 'border-box',
              width: '100%',
              maxWidth: '900px'
            }}
          >
            <h2>
              {selectedEvent.name}
            </h2>
            <p>
              <strong>
                Type: 
              </strong>
              {' '}
              {selectedEvent.event_type}
            </p>
            <p>
              <strong>
                Start Time:
              </strong>
              {' '}
              {new Date(selectedEvent.start_time).toLocaleString()}
            </p>
            <p>
              <strong>
                End Time:
              </strong>
              {' '}
              {new Date(selectedEvent.end_time).toLocaleString()}
            </p>
            <p>
              <strong>
                Description:
              </strong>
              {' '}
            {selectedEvent.description}
            </p>
            <strong>
              Speakers: 
            </strong>
            <ul>
              {selectedEvent.speakers.map((speaker, index) =>
              (
                <li key = {index}
                >
                  {speaker.name}
                </li>
              )
            )}
            </ul>
            {/* Related events navigation */}
            <div
              style={{
                marginTop: '20px'
              }}
            >
              <strong>
                Related Events
              </strong>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  marginTop: '10px'
                }}
              >

                {selectedEvent.related_events.map((relatedId) => {
                  const relatedEvent = events.find(e => e.id === relatedId);
                  if (relatedEvent && (relatedEvent.permission === 'public' || isLoggedIn)) {
                    return (
                      <button 
                        aria-label= {relatedEvent.name}
                        key={relatedId}
                        onClick={() => setSelectedEvent(relatedEvent)}
                        style={{
                          padding: '10px',
                          cursor: 'pointer',
                          border: '2px solid #333',
                          borderRadius: '10px',
                          backgroundColor: '#8cc6ff'
                        }}
                      >
                        {relatedEvent.name}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

          </div>
        </div>
      )}


    </div>
  )
}
export default App