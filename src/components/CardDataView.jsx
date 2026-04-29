import Link from "next/link";
import { CardData } from "@/data/CardData";

export default function CardDataView() {
  return (
    <div className="articles">
      <div className="container">
        <h2 className="articles_title">Menu</h2>
        <div className="articles_items">
          {CardData.map((card) => (
            <Link
              key={card.id}
              href={card.link}
              className="article"
              style={{
                background: `url('${card.img}')`,
                backgroundSize: "cover",
              }}
            >
              <div className="article_filtre" />
              <div className="article_name">
                {card.title}
              </div>
              <div className="article_icon">
                <i className="fa fa-play" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
