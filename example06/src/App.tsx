import { Admin, Resource,ShowGuesser,EditGuesser,ListGuesser,CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";
import { Layout } from "./Layout";
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Dashboard } from "./Dashboard";
import { authProvider } from "./authProvider";
import { dataProvider } from "./dataProvider";
import { CategoryList, CategoryCreate, CategoryEdit } from "./component/Category";
import { ProductList, ProductCreate,ProductEdit } from "./component/Product";
import { CartList } from "./Cart";
import { CartShow } from "./Cart";
import ProductImageUpdate from "./component/ProductImageUpdate";


export const App = () => (
  <Admin authProvider={authProvider} layout={Layout} dataProvider={dataProvider} dashboard={Dashboard}>
    <CustomRoutes>
      <Route path="/products/:id/image" element={<ProductImageUpdate />} />
    </CustomRoutes>
    <Resource name="categories" list={CategoryList} create={CategoryCreate} edit={CategoryEdit} icon={CategoryIcon} />
    <Resource name="products" list={ProductList} create={ProductCreate} edit={ProductEdit} icon={Inventory2Icon} />
    <Resource name="carts" list={CartList} show={CartShow} icon={ShoppingCartIcon}/>
  </Admin>
);
export default App;
