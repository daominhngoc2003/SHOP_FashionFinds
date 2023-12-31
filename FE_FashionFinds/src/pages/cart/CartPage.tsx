import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { deleteAllProductCart, deleteProductCart, getCartByUser } from "../../actions/cart";
import { Link } from "react-router-dom";
import { UpdateProductCart } from "../../api/Cart";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const CartPage = () => {

  // state
  const dispatch = useAppDispatch();
  const { carts, isLoading } = useAppSelector((state: any) => state.carts);
  const productList = carts?.products;
  const [removeLoadingMap, setRemoveLoadingMap] = useState<Record<number | string, boolean>>({});

  // get user from localstorerage
  const userStr = localStorage.getItem("users");
  const user = userStr ? JSON.parse(userStr) : null;
  const { _id } = user?.user || {};

  useEffect(() => {
    if (user) {
      dispatch(getCartByUser(_id)).unwrap();
    }
  }, [dispatch]);

  // delete product by user
  const onHandleRemoveProduct = async (id: string) => {
    setRemoveLoadingMap((prevMap) => ({ ...prevMap, [id]: true }));
    const formRemove = {
      productId: id,
      userId: _id
    }
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa");
    if (confirm) {
      await dispatch(deleteProductCart(formRemove));
      setRemoveLoadingMap((prevMap) => ({ ...prevMap, [id]: false }));
      dispatch(getCartByUser(_id));
    }
  };

  const onHandleRemoveAll = async () => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm");
    if (confirm) {
      await dispatch(deleteAllProductCart(_id));
    }
  }

  const increase = async (cart: any) => {
    const quantity = cart.quantity + 1;
    const cartUpdate: any = {
      quantity,
      productId: cart.productId._id,
      userId: _id,
    }
    try {
      if (user) {
        await UpdateProductCart(cartUpdate)
        dispatch(getCartByUser(_id));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const decrease = async (cart: any) => {
    const quantity = cart.quantity - 1;
    const cartUpdate: any = {
      quantity,
      productId: cart.productId._id,
      userId: _id,
    }
    try {

      if (quantity < 1) {
        const confirm = window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng ?");
        const formRemove = {
          productId: cart.productId._id,
          userId: _id
        }
        if (confirm) {
          await dispatch(deleteProductCart(formRemove));
          dispatch(getCartByUser(_id));
        }
        cart.quantity = 1;
      }

      await UpdateProductCart(cartUpdate);
      dispatch(getCartByUser(_id));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-gray-[#e7e7e7]">
      <div className="md:max-w-[1240px] mx-auto w-full mt-5">
        <div className="border border-yellow-300 bg-yellow-[#fffefb] px-4 py-2 flex items-center space-x-2">
          <i className="fa-solid fa-truck-fast text-[#167972]"></i>
          <h1>
            Nhấn vào mục Mã giảm giá ở cuối trang để hưởng miễn phí vận chuyển
            bạn nhé!
          </h1>
        </div>
        <table className="w-full my-3 mb-6">
          <thead className="bg-white md:block hidden border-b">
            <tr className="flex items-center font-bold">
              <td className="py-3 md:w-[600px] pl-7">Sản phẩm</td>
              <td className="md:w-[150px] text-center">Đơn giá</td>
              <td className="md:w-[150px] text-center">Số lượng</td>
              <td className="md:w-[150px] text-center">Số tiền</td>
              <td className="md:w-[190px] text-center">Thao tác</td>
            </tr>
          </thead>
          {productList?.length > 0 ? (
            <tbody className="bg-white px-5 shadow-lg">
              {productList?.map((item: any, index: string) => {
                return (
                  <div key={index}>
                    <tr
                      className="flex items-center border border-b-blue-100 mb-2"
                    >
                      <td className="py-3 md:w-[600px] w-[170px] flex px-2 md:px-7 space-x-2 md:space-x-5">
                        <div className="md:max-w-[100px] max-w-[50px]">
                          <img src={item?.productId?.product_images} alt="" />
                        </div>
                        <div className="flex flex-col md:gap-y-5">
                          <Link to="#" className="md:text-[16px] text-[12px]">
                            <h1>{item?.productId?.product_name}</h1>
                          </Link>
                          <div className="flex">
                            <p className="text-blue-500 md:text-[16px] text-[12px] font-medium">
                              {item?.color} / {item?.size}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="md:w-[150px] text-center md:text-[16px] text-[12px] text-red-500 font-bold">
                        <p>{item?.productId?.product_price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                      </td>
                      <td className="md:w-[150px] flex text-center">
                        <form className="flex items-center px-1 md:ml-4">
                          <div
                            onClick={() => decrease(item)}
                            className=" md:px-4 px-1 md:py-2 text-[#7A7A9D] text-xl border border-gray-300 rounded-s cursor-pointer">
                            -
                          </div>
                          <span
                            className="inline-block px-1 outline-none md:px-4 md:py-2 text-center border border-t-gray-300  text-[#7A7A9D] text-xl ">
                            {item?.quantity}
                          </span>
                          {/* <input
                          type="text"
                          defaultValue={item?.quantity}
                          {...register("quantity")}
                          className="inline-block outline-none  w-10 h-10 text-center border border-t-gray-300  text-[#7A7A9D] text-xl " /> */}
                          <div
                            onClick={() => increase(item)}
                            className=" md:px-4 md:py-2 px-1 border  cursor-pointer border-gray-300 rounded-r text-[#7A7A9D] text-xl">
                            +
                          </div>
                        </form>
                      </td>
                      <td className="md:w-[150px] text-center text-red-500 font-bold">
                        {item?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </td>
                      <td className="md:w-[190px] text-center">
                        <button onClick={() => onHandleRemoveProduct(item?.productId?._id)}>
                          {removeLoadingMap[item?.productId?._id] && isLoading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                          ) : (
                            <i className="fa-solid fa-trash text-[#f00a0a]"></i>
                          )}
                        </button>
                      </td>
                    </tr>
                  </div>

                );
              })}
            </tbody>
          ) : (
            <div className="p-2 text-center text-red-500 bg-slate-50">
              Giỏ hàng trống
            </div>
          )}
        </table>
        {carts?.products?.length > 0 &&
          <div className="bg-white md:px-5 px-2 md:flex items-center justify-between mb-6 py-3">
            <button
              onClick={() => onHandleRemoveAll()}
              className="bg-red-600 md:text-[14px] text-[12px] text-white rounded-sm md:px-10 py-2 hover:bg-red-700 transition-all">
              Xóa tất cả</button>
            <div className="checkout flex md:space-x-5 items-center">
              <div className="flex space-x-2 md:text-[14px] text-[10px]">
                <p className="md:mr-5 mr-2 ml-2 md:text-[14px]  text-[10px]">Phí ship:{carts?.shippingFee?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 0}</p>
                (<p>Tổng thanh toán:{productList?.length || 0} sản phẩm</p>)
                <span className="text-red-600 font-medium md:text-[14px] text-[12px]">
                  {carts.totalOrder?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
              </div>
              {carts ? <Link to="/checkout" className="bg-red-600 ml-3 px-2 text-white md:text-[14px] text-[12px] rounded-sm md:px-10 py-2 hover:bg-red-700 transition-all">
                Mua hàng
              </Link> : ''}
            </div>
          </div>
        }
      </div>

    </div >
  );
};

export default CartPage;
