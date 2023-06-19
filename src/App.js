import React from 'react';
import './index.scss';
import Collection from './components/Collection';

const categories = [
  { "name": "Все" },
  { "name": "Море" },
  { "name": "Горы" },
  { "name": "Архитектура" },
  { "name": "Города" }
];

function App() {
  const [collection, setCollection] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [categoryID, setCategoryID] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState('');

  React.useEffect(() => {
    setIsLoading(true);

    const category = categoryID ? `category=${categoryID}` : '';

    fetch(`https://64900c531e6aa71680ca6c4c.mockapi.io/photo-collection?page=${page}&limit=3&${category}`)
    .then((res) => res.json())
    .then((json) => setCollection(json))
    .catch((err) => {
      console.warn(err);
      alert('Ошибка загрузки коллекции');
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [categoryID, page]);

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {
            categories.map((obj, index) => {
              return <li onClick={() => setCategoryID(index)} className={ categoryID === index ? 'active' : ''} key={obj.name}>
                {obj.name}
              </li>
            })
          }
        </ul>
        <input 
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="search-input" 
        placeholder="Поиск по названию" />
      </div>
      <div className="content">
        {
          isLoading ? (<h2>Идет загрузка . . .</h2>) : (
            collection
            .filter((obj) => {
              return obj.name.toLowerCase().includes(searchValue.toLowerCase());
            })
            .map((obj,index) => 
              <Collection key={index} name={obj.name} images={obj.photos} />)
          )
        }
        {/* знаю что использование индекса для ключа плохая практика */}
      </div>
      
      <ul className="pagination">
       {
        [...Array(5)].map((_, i) => (
          <li onClick={() => setPage(i + 1)} className={page === i + 1 ? 'active' : ''}>{i + 1}</li>
        ))
       }
      </ul>
    </div>
  );
}

export default App;
