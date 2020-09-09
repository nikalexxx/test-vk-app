import './place.css';

import { Link, withRouter } from 'react-router-dom';
import React, { useMemo, useState } from 'react';

import Checkbox from './Checkbox';
import accounting from 'accounting';
import edit from '../img/edit.svg';

const isErrorTime = timeString => !/^\d{2}:\d{2}$/.test(timeString);

const getSavedBasket = () => (JSON.parse(localStorage.getItem('basket') || 'null') || {});

const setParam = (name, value, set, key) => {
  set(value);
  const current = getSavedBasket();
  if (!(key in current)) {
    current[key] = {};
  }
  current[key][name] = value;
  localStorage.setItem('basket', JSON.stringify(current));
}

const Basket = ({ match: { params: { areaId, itemId }}, foodAreas, order }) => {
  const key = `${areaId}.${itemId}`;
  const savedBasket = getSavedBasket();
  const basket = savedBasket[key] || {};
  const [ faster, setFaster ] = useState('faster' in basket ? basket.faster : true);
  const [ time, setTime ] = useState('time' in basket ? basket.time : '');
  const [ selfService, setSelfService ] = useState('selfService' in basket ? basket.selfService : false);


  const params = {
    setFaster: value => setParam('faster', value, setFaster, key),
    setTime: value => setParam('time', value, setTime, key),
    setSelfService: value => setParam('selfService', value, setSelfService, key)
  };

  const area = foodAreas.filter(area => area.id === areaId)[0];
  const item = area.items.filter(item => item.id === itemId)[0];

  const [ price, products, priceNumber ] = useMemo(() => {
    const foodIds = new Set((item.foods || []).map(item => item.id));

    const products = Object.values(order)
      .filter((value) => {
        const { item: { id }} = value;

        return foodIds.has(id);
      });

    const result = products.reduce((result, value) => {
        const { count, item } = value;

        return result + parseInt(item.price) * parseInt(count);
      }, 0);

    return [ accounting.formatNumber(result, 0, ' '), products, result ];
  }, [ order, item ]);

  return (
    <div className="Place">
      <header className="Place__header">
        <aside className="Place__trz">
          <h1 className="Place__head">
            <Link to="/" className="Place__logo">
              {area.name}
            </Link>
          </h1>
          <Link to="/edit" className="Place__change-tz">
            <img
              alt="change-profile"
              src={edit}
            />
          </Link>
        </aside>
      </header>
      <aside className="Place__restoraunt">
        <img
          className="Place__restoraunt-logo"
          alt="Fastfood logo"
          src={item.image}
        />
        <h2
          className="Place__restoraunt-name"
        >
          {item.name}
        </h2>
        <p className="Place__restoraunt-type">
          {item.description}
        </p>
      </aside>
      <div className="Place__products-wrapper">
        <ul className="Place__products">
          {products.map(({ item, count }) => (
            <li
              className="Place__product"
              key={item.id}
            >
              <img
                className="Place__product-logo"
                alt="Ordered product logo"
                src={item.image}
              />
              <h3
                className="Place__product-name"
              >
                {item.name}
              </h3>
              <p
                className="Place__product-price"
              >
                Цена: {item.price}
              </p>
              <p
                className="Place__product-count"
              >
                x{count}
              </p>
            </li>
          ))}
        </ul>
        <Link
          className="Place__change-product"
          to={`/place/${areaId}/${itemId}`}
        >
          Изменить
        </Link>
      </div>
      <div className="Place__choice">
        <h3>Время:</h3>
        <div className="Place__choice-item">
          <span>Как можно быстрее</span>
          <Checkbox 
            checked={faster} 
            onToggle={() => {
              if (faster) {
                params.setFaster(false);
              } else {
                params.setTime('');
                params.setFaster(true);
              }
            }}
          />
        </div>
        <div className="Place__choice-item">
          <span>Назначить</span>
          <input
            value={time}
            type="time"
            onFocus={() => {
              params.setFaster(false);
            }}
            onChange={event => {
              params.setFaster(false);
              const value = event.target.value.trim();
              params.setTime(value);
            }}
            onBlur={() => {
              if (time) {
                params.setFaster(false);
              }
            }}
          />
          {isErrorTime(time) && !faster &&
          <div style={{color: 'red', fontSize: '.8em'}}>Введите время в формате hh:mm</div>
          }
        </div>
        <div className="Place__choice-item">
          <h3>С собой</h3>
          <Checkbox checked={selfService} onToggle={() => params.setSelfService(!selfService)} />
        </div>
        <div className="Place__choice-item">
          <h3>На месте</h3>
          <Checkbox checked={!selfService} onToggle={() => params.setSelfService(!selfService)} />
        </div>
      </div>
      <footer className="Place__footer">
        {priceNumber > 0 && (!isErrorTime(time) || faster) &&
        <Link to={`/order/${area.id}/${item.id}`} className="Place__order">
          Оплатить {price}
        </Link>}
      </footer>
    </div>
  );
};

export default withRouter(Basket);
