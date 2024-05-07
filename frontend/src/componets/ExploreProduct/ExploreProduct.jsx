import "./ExploreProduct.css";
import { product_list } from "../../assets/assets";

// eslint-disable-next-line react/prop-types
const ExploreProduct = ({category, setCategory}) => {
  return (
    <div className="explore-product" id="explore-product">
      <h1>Explore our product</h1>
      <p className="explore-product-text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae ipsam
        quas facilis tempore dignissimos fuga?
      </p>
      <div className="explore-product-list">
        {product_list.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.product_name ? "All" : item.product_name
                )
              }
              key={index}
              className="explore-product-list-item"
            >
              <img
                className={category === item.product_name ? "active" : ""}
                src={item.product_image}
                alt=""
              />
              <p>{item.product_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreProduct;
