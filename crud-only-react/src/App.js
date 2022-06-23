import React, { useState } from "react";
import "./App.css"
import { Form, FormGroup, Button } from "reactstrap";
import { nanoid } from "@reduxjs/toolkit";
import { FaTrash } from "react-icons/fa";

const App = () => {
  const [name, setName] = useState("");
  const [count, setCount] = useState();
  const [seller, setSeller] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState("");
  const [selectedPro, setSelectedPro] = useState("");

  let url = "http://localhost:3000/products";

  //*!>>>>>>>>>>>>>>>>>>>>>FORM SUBMIT<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< *//
  const handleSubmit = (e) => {
    const product = { id: nanoid(), name, count, seller, price };
    postProducts(product);
    setName("");
    setCount(0);
    setSeller("");
    setPrice("");
    e.preventDefault();
  };

  //*!>>>>>>>>>>>>>>>>>>>>>POST  REQUEST<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< *//
  const postProducts = async (products) => {
    setProducts((pre) => {
      let copy = [...pre];
      copy.push(products);
      return copy;
    });
    try {
      let request = await fetch(url, {
        method: "POST",
        body: JSON.stringify(products),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      return await request.json();
    } catch (error) {
      throw new Error(error);
    }
  };
  //*!>>>>>>>>>>>>>>>>>>>>>GET REQUEST<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< *//
  const getProducts = async () => {
    try {
      let request = await fetch(url);
      return await request.json().then((data) => {
        if (data && data.length) {
          setProducts(data);
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  //*!>>>>>>>>>>>>>>>>>>>>>DELETE ALL PRODUCTS REQUEST<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< *//
  const deleteRequest = async (id) => {
    try {
      if (id) {
        let request = fetch(url + `/${id}`, {
          method: "DELETE",
        });

        return await request.json();
      } else {
        products.map((pro) => {
          console.log(pro.id);
          fetch(url + `/${pro.id}`, {
            method: "DELETE",
          });
        });
        setProducts("");
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  //*!>>>>>>>>>>>>>>>>>>>>>DELETE ONE PRODUCT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< *//
  const deleteProduct = (pro) => {
    let newState = [...products];
    newState.map((item) => {
      if (item.id === pro.id) {
        const index = newState.indexOf(pro);

        if (index > -1) {
          newState.splice(index, 1);
        }
        deleteProduct(pro.id);
        setProducts(newState);
      }
    });
  };

  //*!>>>>>>>>>>>>>>>>>>>>>WRITE SELECTED ROW TO INPUT<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< *//

  const selectProduct = (pro) => {
    setName(pro.name);
    setCount(pro.count);
    setSeller(pro.seller);
    setPrice(pro.price);
    setSelectedPro(pro);
    console.log(selectedPro);
  };

  //*!>>>>>>>>>>>>>>>>>>>>>UPDATE STATE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< *//

  const updateProduct = (pro) => {
    const product = { id: pro.id, name, count, seller, price };
    setProducts((pre) => {
      let copy = [...pre];
      copy.map((item) => {
        if (item.id === pro.id) {
          item.name = product.name;
          item.count = product.count;
          item.seller = product.seller;
          item.price = product.price;
        }
      });
      return copy;
    });
    putProducts(product);
    setName("");
    setCount(0);
    setSeller("");
    setPrice("");
  };

  //*!>>>>>>>>>>>>>>>>>>>>>PUT REQUEST<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< *//

  const putProducts = async (product) => {
    try {
      let request = await fetch(url + `/${product.id}`, {
        method: "PUT",
        body: JSON.stringify(product),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      url = "";
      return await request.json();
    } catch (error) {
      throw new Error(error);
    }
  };
  return (
    <div>
      <div>
        <div className="container container_padding bg-white">
          <h1 className="bg-light text-center py-3 mb-0">
            <i className="fas fa-plug"></i>
            Electronic Store
          </h1>
          <div className="form-container">
            {/* <!-- !ID CONTENT --> */}
            <div className="form-group py-2">
              <input type="text" name="id" id="id" className="form-control" disabled />
            </div>
            {/* <!-- !PRODUCT NAME --> */}

            <Form onSubmit={handleSubmit}>
              <FormGroup className="price_grid  my_grid">
                <div className="grid_layout py-2">
                  <input type="text" name="name" id="name" placeholder="Product Name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid_layout  py-2">
                  <input type="number" name="quantity" id="quantity" placeholder="Quantity" min="1" max="1000" value={count} onChange={(e) => setCount(e.target.value)} className="form-control" />
                </div>

                {/* <!-- !layout --> */}
                <div className="grid_layout py-2">
                  <input type=" text" name="seller" id="seller" className="form-control " placeholder="Seller" value={seller} onChange={(e) => setSeller(e.target.value)} />
                </div>
                {/* <!-- !layout --> */}
                <div className="grid_layout  py-2">
                  <input type="text" name="price" id="price" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
                </div>
              </FormGroup>
              {/*  <-- !Buttons --> */}
              <FormGroup className="w-100 d-flex justify-content-center py-2">
                <Button className="btn btn-success px-5" id="btn_add" type="submit">
                  Create
                </Button>
              </FormGroup>
            </Form>
            <div className="w-100 d-flex justify-content-between py-2">
              <Button className="btn btn-primary px-5" id="btn_read" onClick={getProducts}>
                Read
              </Button>
              <Button
                className="btn btn-warning px-5"
                id="btn_update"
                onClick={(e) => {
                  updateProduct(selectedPro);
                }}
              >
                Update
              </Button>
              <Button
                className="btn btn-danger px-5"
                id="btn_delete"
                onClick={(e) => {
                  deleteRequest(products.id);
                }}
              >
                Delete All
              </Button>
            </div>
          </div>
          <table className="table table-striped table-hover" id="store">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Seller</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody className="w-100">
              {products.length > 0 ? (
                products.map((product) => {
                  return (
                    <tr value={product} key={product.id} onClick={(e) => selectProduct(product)}>
                      <th scope="row"></th>
                      <td>{product.name}</td>
                      <td>{product.count}</td>
                      <td>{product.seller}</td>
                      <td>{product.price}</td>
                      <td>
                        <FaTrash className="trash" onClick={(e) => {
                            deleteProduct(product);
                          }}
                          />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <div>No Product</div>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
