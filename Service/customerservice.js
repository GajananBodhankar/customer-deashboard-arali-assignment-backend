import Customer from "../Model/customerModel.js";

async function saveCustomer(request, user, session) {
  const { name, email, phone } = request.body;
  const customer = new Customer({ name, email, phone, user: user._id });
  const savedCustomer = await customer.save({ session });
  return saveCustomer;
}

async function getAllCustomers() {
  return await Customer.find({}, { user: 0 });
}

async function deleteCustomerById(id) {
  return await Customer.findByIdAndDelete(id);
}
export { saveCustomer, getAllCustomers, deleteCustomerById };
