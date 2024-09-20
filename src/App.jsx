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

const Images = [
  <img src="/img/post.png" />
];

console.log(Images);

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
  // const mainClass = route.url === '#/' ? 'homeMain' : 'main';

  return (
    <div className="home">
      <h1>THE BLOG</h1>
      <RecentBlog />
      <SomePostsHome />
    </div>
  )
}

function RecentBlog() {
  return (
    <div className="recentBlog">
        <h3>Recent blog posts</h3>
        <div className="blogGrid">
          <div className="blogItem">
            <img src="img/Image.png" alt="" />
            <strong>Olivia Rhye • 1 Jan 2023</strong>
            <h2>UX review presentations</h2>
            <p>How do you create compelling presentations that wow your colleagues and impress your managers?</p>
          </div>
          <div className="blogItem">
            <img src="img/Image1.png" alt="" />
            <div className="blogItemInfo">
              <strong>Olivia Rhye • 1 Jan 2023</strong>
              <h2>UX review presentations</h2>
              <p>How do you create compelling presentations that wow your colleagues and impress your managers?</p>
            </div>
          </div>
          <div className="blogItem">
            <img src="img/Image2.png" alt="" />
            <div className="blogItemInfo">
              <strong>Olivia Rhye • 1 Jan 2023</strong>
              <h2>UX review presentations</h2>
              <p>How do you create compelling presentations that wow your colleagues and impress your managers?</p>
            </div>
          </div>
          <div className="blogItem">
            <img src="img/Image3.png" alt="" />
            <div className="blogItemInfo">
              <strong>Olivia Rhye • 1 Jan 2023</strong>
              <h2>UX review presentations</h2>
              <p>A grid system is a design tool used to arrange content on a webpage. It is a series of vertical and horizontal lines that create a matrix of intersecting points, which can be used to align and organize page elements. Grid systems are used to create a consistent look and feel across a website, and can help to make the layout more visually appealing and easier to navigate.</p>
            </div>
          </div>
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
          <img src="/img/post.png" alt="" />
          <strong>{new Date(x.updatedAt).toLocaleString("tr")}</strong>
          <h2>{x.title}</h2>
          <p>{x.content}</p>
        </div>
        ))}
    </div>
    </div>
  )
}

function Posts() {
  return (
    <>
    </>
  )
}


function Main() {
  const route = useContext(RouterContext);

  return (
    <div className='main'>
      {route.element}
    </div>
  );
}

export default App
