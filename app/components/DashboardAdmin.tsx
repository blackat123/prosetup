import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import DeleteConfirmationModal from "./DeleteConfimationModal";

interface Product {
  id: number | null;
  nama_produk: string;
  harga_satuan: string;
  quantity: string;
  created_at?: string;
}

export default function DashboardAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [formMessage, setFormMessage] = useState({ type: "", text: "" });
  const [formValues, setFormValues] = useState<{
    id: number | null;
    nama_produk: string;
    harga_satuan: string;
    quantity: string;
  }>({
    id: null,
    nama_produk: "",
    harga_satuan: "",
    quantity: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMessage({ type: "", text: "" });
    if (!formValues.nama_produk || !formValues.harga_satuan || !formValues.quantity) {
      setFormMessage({ type: "error", text: "Semua field harus diisi!" });
      return;
    }

    const productData = {
      nama_produk: formValues.nama_produk,
      harga_satuan: parseInt(formValues.harga_satuan),
      quantity: parseInt(formValues.quantity),
    };

    let supabaseQuery;
    if (isEditing) {
      supabaseQuery = supabase.from("products").update(productData).eq("id", formValues.id);
    } else {
      supabaseQuery = supabase.from("products").insert([productData]);
    }

    const { error } = await supabaseQuery;

    if (error) {
      setFormMessage({ type: "error", text: error.message });
    } else {
      setFormMessage({
        type: "success",
        text: `Produk berhasil ${isEditing ? "diperbarui" : "ditambahkan"}!`,
      });
      resetForm();
      await fetchProducts();
    }
  };

  const handleEdit = (product: Product) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsEditing(true);
    setFormValues(product);
    setFormMessage({ type: "", text: "" });
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete && productToDelete.id !== null) {
      const { error } = await supabase.from("products").delete().eq("id", productToDelete.id);

      if (error) {
        setError(error.message);
      } else {
        await fetchProducts();
      }
    }
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  const resetForm = () => {
    setFormValues({ id: null, nama_produk: "", harga_satuan: "", quantity: "" });
    setIsEditing(false);
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          {isEditing ? "Edit Produk" : "Tambah Produk Baru"}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="nama_produk" className="block text-sm font-medium text-gray-700">
                Nama Produk
              </label>
              <input
                type="text"
                name="nama_produk"
                id="nama_produk"
                placeholder="e.g., Laptop"
                value={formValues.nama_produk}
                onChange={handleInputChange}
                className="mt-1 px-3 py-2 placeholder-gray-400 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
                required
              />
            </div>
            <div>
              <label htmlFor="harga_satuan" className="block text-sm font-medium text-gray-700">
                Harga Satuan
              </label>
              <input
                type="number"
                name="harga_satuan"
                id="harga_satuan"
                placeholder="e.g., 15000000"
                value={formValues.harga_satuan}
                onChange={handleInputChange}
                className="mt-1 px-3 py-2 placeholder-gray-400 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
                required
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                placeholder="e.g., 50"
                value={formValues.quantity}
                onChange={handleInputChange}
                className="mt-1 px-3 py-2 placeholder-gray-400 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            >
              {isEditing ? "Update Produk" : "Simpan Produk"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setFormMessage({ type: "", text: "" });
                }}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              >
                Batal
              </button>
            )}
          </div>
          {formMessage.text && (
            <p
              className={`text-sm ${
                formMessage.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {formMessage.text}
            </p>
          )}
        </form>
      </div>

      {/* Tabel Produk */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Manajemen Produk</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nama Produk
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Harga Satuan
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.nama_produk}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rp {Number(product.harga_satuan).toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex justify-center">
                    <button
                      onClick={() => handleEdit(product)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-700 cursor-pointer"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (product.id !== null) handleDelete(product);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded bg-red-100 hover:bg-red-200 text-red-700 cursor-pointer"
                      title="Delete"
                      disabled={product.id === null}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-sm text-gray-500">
                    Tidak ada produk tersedia. Silakan tambahkan produk baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.nama_produk || ""}
      />
    </div>
  );
}
