import React, { useState } from 'react';
import { CardData } from '../data/CardData';

const CardDataView = () => {

	const [cardData] = useState(CardData);

    return (
        <div className="articles">
			<div className="container">
				<h2 className="articles_title">Menu</h2>
				<div className="articles_items" >
					{cardData && cardData.map((card, index) => (
						<a card={card} key={index} href={cardData[index].link} className="article" style={{background: `url('${cardData[index].img}')`, backgroundSize: "cover"}}>
							<div className="article_filtre"></div>
							<div className="article_name">{cardData.logo} {cardData[index].title}</div>
							<div className="article_icon"><i className="fa fa-play"></i></div>
						</a>
					))}
				</div>
			</div>
		</div>
    );
};

export default CardDataView;