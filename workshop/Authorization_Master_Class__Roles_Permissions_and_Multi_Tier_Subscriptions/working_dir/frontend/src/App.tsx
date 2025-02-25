import { AuthGuard, HasPermission, HasRole } from './components/AuthGuard';
import { CallAPI } from './components/CallAPI';
import { Login } from './components/Login';
import { Profile } from './components/Profile';

function App() {
	return (
		<div>
			<AuthGuard fallback={<Login />}>
				<Profile />
				<CallAPI />
				<HasRole requiredRole='admin'>
					<button>Go to Admin Panel</button>
				</HasRole>
				<ManageProducts />
			</AuthGuard>
		</div>
	);
}

export default App;

const ManageProducts = () => {
	return (
		<div>
			<div>
				<h1>Manage Products</h1>
				<HasPermission requiredPermissions='product:create'>
					<button>Add Product</button>
				</HasPermission>
			</div>
			<div>
				<h3>Product List</h3>
				<HasPermission requiredPermissions='product:read'>
					<ProductItem />
					<ProductItem />
					<ProductItem />
				</HasPermission>
			</div>
		</div>
	);
};

const ProductItem = () => {
	return (
		<div>
			<h4>Product Name</h4>
			<p>Product Description</p>
			<div>
				<HasPermission requiredPermissions='product:update'>
					<button>Update</button>
				</HasPermission>
				<HasPermission requiredPermissions='product:delete'>
					<button>Delete</button>
				</HasPermission>
			</div>
		</div>
	);
};
