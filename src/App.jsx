import { createContext, useContext, useEffect, useState } from 'react'
import './App.css'

const RouterContext = createContext(null);
const PostContext = createContext(null);

const routes = [
  {
    id: crypto.randomUUID(),
    name: 'Home',
    url: '#/',
    element: <Home />,
  },
  {
    id: crypto.randomUUID(),
    name: 'Posts',
    url: '#/posts',
    element: <Posts />,
  },
];

const notFound = {
  name: 'Page not found',
  element: <NotFound />,
}

function getRoute(routeUrl) {
  const route = routes.find(x => x.url === routeUrl);
  return route ?? notFound; 
}

const title = "App";

function setTitle(pageTitle) {
  document.title = `${pageTitle} - ${title}`;
}

function App() {
  const [route, setRoute] = useState(
    () => {
      if (location.hash.length < 2) {
        return routes[0];
      }
      return getRoute(location.hash);
    }
  );
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    setTitle(route.name);
  }, [route]);

  useEffect(() => {
    window.addEventListener('hashchange', function () {
      setRoute(getRoute(location.hash));
    });
  }, []);


  return (
    <RouterContext.Provider value={route}>
      <div className='container'>
        <Header />
        <PostContext.Provider value={{ postId, setPostId }}>
          <Main />
        </PostContext.Provider>
      </div>
    </RouterContext.Provider>
  )
}

function Header() {
  return (
    <div className='header'>
      <a href="/#" className='logo'> <img src="/img/blogger.svg" alt="" /> </a>
      <Nav />
      <div className='toggle'>
        <img className='lightsun' src="img/lightsun.svg" alt="light sun" />
        <img className='darksun' src="img/darksun.svg" alt="dark sun" />
        <label className="switch">
          <input type="checkbox" />
          <span className="slider round"></span>
        </label>
        <img className='lightmoon' src="img/lightMoon.svg" alt="Light moon" />
        <img className='darkMoon' src="img/darkMoon.svg" alt="dark moon" />
      </div>
    </div>
  )
}

function Nav() {
  const route = useContext(RouterContext);

  return (
    <ul className="nav">
      {routes.map(x =>
        <li key={x.id}>
          <a href={x.url} className={route.url === x.url ? 'selected' : ''}>{x.name}</a>
        </li>)}
    </ul>
  )
}

function Home() {
  const route = useContext(RouterContext);

  return (
    <div className="home">
      <h1>THE BLOG</h1>
      <RecentBlog />
      <SomePostsHome />
    </div>
  )
}

function RecentBlog() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData(){
        const response = await fetch("http://localhost:3000/api/posts"); 
        const postdata = await response.json();
        setData([...data, ...postdata]);
    }
    getData();
  }, []);

  return (
    <div className="recentBlog">
      <h3>Recent blog posts</h3>
      <div className="blogGrid">
        {data.slice(0, 4).map((x, i) => (
          <div className="blogItem" key={i}>
            <img src={`img/Image${i}.png`} alt={`Blog Post ${i}`} />
            <div className="blogItemInfo">
              <strong>{x.author} • {new Date(x.updatedAt).toLocaleDateString("tr")}</strong>
              <h2>{x.title}</h2>
              <p>{x.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SomePostsHome() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fakeData = Array(10).keys().map((i) => (
      {
        id: data.length + 1 + i, 
        title: `title ${data.length + 1 + i}`,
        content: `content ${data.length + 1 + i}`
      }
    ))
    setData([...data, ...fakeData]);
  }, [])

  useEffect(() => {
    async function getData(){
        const response = await fetch("http://localhost:3000/api/posts"); 
        const postdata = await response.json();
        setData([...data, ...postdata]);
    }
    getData();
  }, []);

  return (
    <div className='someposts'>
        <h3>Some Blog Posts</h3>
      <div className='postItem'>
        {data.slice(0, 6).map((x, i) => (
        <div className='post' key={i}>
            <img src={`img/post${i}.png`} alt={`post ${i}`} />
          <strong>{new Date(x.updatedAt).toLocaleString("tr")}</strong>
          <div className="route">
          <h2>{x.title}</h2> 
           <a href='#'> <img src="/img/routingIcon.svg" alt="" /></a>
          </div>
          <p>{x.content}</p>
        </div>
        ))}
    </div>
    </div>
  )
}

function Posts() {
  const [data, setData] = useState([]);
  const { setPostId } = useContext(PostContext);

  useEffect(() => {
    async function getData(){
        const response = await fetch("http://localhost:3000/api/posts"); 
        const postdata = await response.json();
        setData([...data, ...postdata]);
    }
    getData();
  }, []);

  return (
    <div className='someposts'>
        <h3>All Blog Posts</h3>
      <div className='postItem'>
        {data.map((x, i) => (
        <div className='post' key={i}>
          <img src={`img/post${i}.png`} alt={`post ${i}`} />
          <strong>{new Date(x.updatedAt).toLocaleString("tr")}</strong>
          <div className="route" style={{display: 'flex'}}>
            <h2>{x.title}</h2> 
            <a href='#'  onClick={e => { e.preventDefault(); setPostId(x.id)}}> <img src="/img/routingIcon.svg" alt="" /></a>
          </div>
          <p>{x.content}</p>
        </div>
        ))}
    </div>
    </div>
  )
}


function Main() {
  const route = useContext(RouterContext);
  const [postDetail, setPostDetail] = useState(null); 
  const { postId, setPostId } = useContext(PostContext);

  useEffect(() => {
    async function getData(){
      if (postId) {
          const response = await fetch(`http://localhost:3000/api/posts/${postId}`);
          const postdata = await response.json();
          setPostDetail(postdata); 
      }
    }
    getData();
  }, [postId]);

  function handleClick(e) {
    e.preventDefault();
    setPostId(null);  
  }

  return (
    <div className='main'>
      {postId && route.url === '#/posts' ? (
        <>
          <a href="#" onClick={handleClick}> <img style={{width: '26px'}} src="/img/back.svg" alt="back icon" /> </a>
          {postDetail ? ( 
            <>
              <h2>{postDetail.title}</h2>
              <p>{postDetail.content}</p>
            </>
          ) : (
            <p>Loading...</p> 
          )}
        </>
      ) : (
        route.element 
      )}
    </div>
  );
}

function NotFound() {
  return (
    <p>Page not found. <a href="#/">return home</a></p>
  )
}

export default App
