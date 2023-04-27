import React, { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
// import Header from "../coman_pages/Header";
// import Footer from "../coman_pages/Footer";
import api from "../lib/api";
import Header from "./Header";

function Datatable() {
  const [burnData, setBurnData] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const getBurnRaffles = async () => {
      try {
        setLoading(true);
        setBurnData({});
        const response = await api.get(
          `${process.env.REACT_APP_API_BASE_URL}/burn-raffles/all?page=${page}`
        );

        // const data = await response.json();
        setBurnData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getBurnRaffles();
  }, [page]);

  console.log("burnData = ", burnData);

  return (
    <>
      <Header />

      <div
        className="customgray customtop container-fluid"
        style={{ minHeight: "70vh", background: "#F8F9FC" }}
      >
        <Table striped bordered hover size="sm" responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Wallet address</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading</td>
              </tr>
            ) : burnData?.data && burnData?.data?.length > 0 ? (
              burnData.data.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.mobile}</td>
                  <td>{item.walletAddress}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No Data Found</td>
              </tr>
            )}
          </tbody>
        </Table>
        <div className="d-flex justify-content-end m-5">
          <Pagination>
            <Pagination.First onClick={() => setPage(1)} />
            <Pagination.Prev
              onClick={() => {
                if(page > 1) {
                  setPage(page - 1);
                }
              }}
            />
            <Pagination.Item active={page === 1} onClick={() => setPage(1)}>{1}</Pagination.Item>

            {burnData?.totalPage > 3 && page > 2 &&<Pagination.Ellipsis />}


            {burnData?.totalPage > 2 && <Pagination.Item active={page > 1 && page < burnData?.totalPage} onClick={() => setPage(page <= 2 ? 2 : page > burnData?.totalPage - 1 ? burnData?.totalPage - 1 : page)}>{page <= 2 ? 2 : page > burnData?.totalPage - 1 ? burnData?.totalPage - 1 : page}</Pagination.Item>}

            {burnData?.totalPage > 3 && page < burnData?.totalPage - 1 && <Pagination.Ellipsis />}

            {burnData?.totalPage > 1 && <Pagination.Item active={page === burnData?.totalPage} onClick={() => setPage(burnData?.totalPage)}>{burnData?.totalPage}</Pagination.Item>}

            <Pagination.Next 
              onClick={() => {
                if(page < burnData?.totalPage) {
                  setPage(page + 1);
                }
              }}
            />
            <Pagination.Last onClick={() => {burnData?.totalPage > 0 && setPage(burnData?.totalPage)}} />
          </Pagination>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
export default Datatable;
