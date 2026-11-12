'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Store,
  Package,
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Truck,
  CheckCircle2,
  Clock,
  Save,
  X,
  ExternalLink,
} from 'lucide-react';

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, switchAccount } = useAuth();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'store'
  const [data, setData] = useState({ store: null, products: [], incomingOrders: [], categories: [] });
  const [loading, setLoading] = useState(true);

  // Form tambah/edit produk modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: '',
    price: '',
    stock: '',
    imageUrl: '',
    brand: '',
    description: '',
    isFeatured: false,
  });

  // Form edit profil toko
  const [storeForm, setStoreForm] = useState({ name: '', description: '', logoUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const loadData = useCallback(async () => {
    if (!user || user.role !== 'seller') {
      setLoading(false);
      return;
    }

    if (user.status !== 'approved') {
      router.push('/seller/pending');
      return;
    }

    try {
      const res = await fetch(`/api/seller?sellerId=${user.id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.store) {
          setStoreForm({
            name: json.store.name || '',
            description: json.store.description || '',
            logoUrl: json.store.logo_url || '',
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      categoryId: data.categories[0]?.id || '',
      price: '',
      stock: '',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
      brand: 'Pro Esports',
      description: '',
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      categoryId: p.category_id,
      price: p.price,
      stock: p.stock,
      imageUrl: p.image_url,
      brand: p.brand || '',
      description: p.description || '',
      isFeatured: Boolean(p.is_featured),
    });
    setModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedbackMsg({ type: '', text: '' });

    try {
      const action = editingProduct ? 'update_product' : 'create_product';
      const res = await fetch('/api/seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          sellerId: user.id,
          productId: editingProduct?.id,
          ...productForm,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Gagal menyimpan produk.');

      setFeedbackMsg({ type: 'success', text: 'Produk berhasil disimpan.' });
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!confirm('Hapus produk ini dari katalog toko Anda?')) return;

    try {
      const res = await fetch(`/api/seller?sellerId=${user.id}&productId=${prodId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || 'Gagal menghapus produk.');
      }
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch('/api/seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_order_status',
          sellerId: user.id,
          orderId,
          newStatus,
        }),
      });
      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || 'Gagal mengubah status.');
      }
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedbackMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_store',
          sellerId: user.id,
          ...storeForm,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Gagal memperbarui profil toko.');

      setFeedbackMsg({ type: 'success', text: 'Profil toko berhasil diperbarui.' });
      await loadData();
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== 'seller') {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 p-8 rounded-2xl bg-[#151A23] border border-[#262E3D]">
        <div className="w-12 h-12 rounded-full bg-[#262E3D] flex items-center justify-center mx-auto text-[#FF5E00]">
          <Store className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Akses Khusus Seller</h2>
        <p className="text-xs text-gray-400">
          Anda belum masuk sebagai Seller yang terverifikasi.
        </p>
        <button
          onClick={() => switchAccount('seller')}
          className="w-full py-2.5 rounded-xl bg-[#FF5E00] text-white font-bold text-xs hover:bg-[#FF5E00]/90 transition-all"
        >
          Masuk sebagai Seller Approved (Apex Gear)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Dashboard Toko */}
      <div className="p-6 rounded-2xl bg-[#151A23] border border-[#262E3D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0B0E14] border border-[#262E3D] text-[#FF5E00] flex items-center justify-center flex-shrink-0">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {data.store?.name || 'Toko Esports'}
              </h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                Approved Merchant
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-xl truncate">
              {data.store?.description || 'Pusat gear turnamen resmi.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-mono">Owner / Seller:</p>
            <p className="text-xs font-bold text-white">{user.name}</p>
          </div>
        </div>
      </div>

      {feedbackMsg.text && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {feedbackMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* 3 Area Tabs Sesuai Spesifikasi (Toko, Produk, Pesanan Masuk) */}
      <div className="flex items-center gap-2 border-b border-[#262E3D] pb-1">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'products'
              ? 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/20'
              : 'text-gray-400 hover:text-white hover:bg-[#151A23]'
          }`}
        >
          <Package className="w-4 h-4" /> Kelola Produk ({data.products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'orders'
              ? 'bg-[#FF5E00] text-white shadow-lg shadow-[#FF5E00]/20'
              : 'text-gray-400 hover:text-white hover:bg-[#151A23]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Pesanan Masuk ({data.incomingOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('store')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'store'
              ? 'bg-[#262E3D] text-white border border-gray-500'
              : 'text-gray-400 hover:text-white hover:bg-[#151A23]'
          }`}
        >
          <Store className="w-4 h-4" /> Profil Toko
        </button>
      </div>

      {/* TAB 1: AREA PRODUK (CRUD) */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Daftar Produk Toko</h2>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00F0FF] text-black font-extrabold text-xs hover:bg-[#00F0FF]/90 transition-all shadow-md shadow-[#00F0FF]/20"
            >
              <Plus className="w-4 h-4" /> Tambah Produk Baru
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400 font-mono">Memuat produk...</div>
          ) : data.products.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#151A23] border border-[#262E3D] text-gray-400 text-xs">
              Belum ada produk di toko Anda. Klik &quot;Tambah Produk Baru&quot; untuk mulai menjual.
            </div>
          ) : (
            <div className="rounded-xl bg-[#151A23] border border-[#262E3D] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B0E14] text-gray-400 uppercase font-mono border-b border-[#262E3D]">
                    <tr>
                      <th className="p-3.5">Produk</th>
                      <th className="p-3.5">Kategori</th>
                      <th className="p-3.5">Harga</th>
                      <th className="p-3.5">Stok</th>
                      <th className="p-3.5">Rating</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262E3D]">
                    {data.products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#1D2432] transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-[#0B0E14] border border-[#262E3D]"
                          />
                          <div className="max-w-xs truncate">
                            <p className="font-bold text-white truncate">{p.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono truncate">{p.brand}</p>
                          </div>
                        </td>
                        <td className="p-3.5 text-gray-300 font-mono">{p.category_name}</td>
                        <td className="p-3.5 font-bold font-mono text-[#00F0FF]">{formatIDR(p.price)}</td>
                        <td className="p-3.5 font-mono text-gray-300">{p.stock} Unit</td>
                        <td className="p-3.5 font-mono text-amber-400">★ {Number(p.rating_avg).toFixed(1)}</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg bg-[#262E3D] text-gray-300 hover:text-white hover:bg-gray-700"
                            title="Edit Produk"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-[#262E3D] text-gray-300 hover:text-rose-400 hover:bg-rose-950/40"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AREA PESANAN MASUK */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Pesanan Masuk dari Pembeli</h2>

          {data.incomingOrders.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#151A23] border border-[#262E3D] text-gray-400 text-xs">
              Belum ada pesanan masuk untuk toko Anda.
            </div>
          ) : (
            <div className="space-y-4">
              {data.incomingOrders.map((ord) => (
                <div key={ord.id} className="p-5 rounded-2xl bg-[#151A23] border border-[#262E3D] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262E3D] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#FF1E27]">{ord.order_number}</span>
                      <span className="text-xs text-gray-400">Pembeli: <strong className="text-white">{ord.buyer_name}</strong> ({ord.buyer_email})</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                      ord.status === 'Selesai' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      ord.status === 'Diproses' ? 'bg-[#FFD000]/10 text-[#FFD000] border border-[#FFD000]/30' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {ord.status}
                    </span>
                  </div>

                  {/* List Barang Milik Toko Ini */}
                  <div className="space-y-2">
                    {ord.items.map((it) => (
                      <div key={it.order_item_id} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#0A0D14] border border-[#20293A]">
                        <div className="flex items-center gap-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={it.product_image} alt="" className="w-9 h-9 rounded object-cover border border-[#20293A]" />
                          <div>
                            <span className="text-white font-medium">{it.product_name}</span>
                            <span className="text-gray-400 ml-1">({it.quantity}x)</span>
                            {(it.selected_variant || it.selected_color) && (
                              <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 mt-0.5">
                                {it.selected_variant && (
                                  <span>Varian: <strong className="text-gray-200">{it.selected_variant}</strong></span>
                                )}
                                {it.selected_color && (
                                  <span>Warna: <strong className="text-[#FFD000]">{it.selected_color}</strong></span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="font-mono font-bold text-[#FF1E27]">{formatIDR(it.subtotal)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs border-t border-[#262E3D]">
                    <p className="text-gray-400 max-w-md">Alamat: <span className="text-gray-200">{ord.shipping_address}</span></p>

                    {/* Tombol Perubahan Status Pesanan */}
                    <div className="flex items-center gap-2">
                      {ord.status === 'Menunggu Pembayaran' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Diproses')}
                          className="px-3 py-1.5 rounded-lg bg-[#00F0FF] text-black font-bold text-xs hover:bg-[#00F0FF]/90 transition-colors"
                        >
                          Proses Pesanan →
                        </button>
                      )}

                      {ord.status === 'Diproses' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'Selesai')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors"
                        >
                          Tandai Selesai ✓
                        </button>
                      )}

                      {ord.status === 'Selesai' && (
                        <span className="text-xs text-emerald-400 font-mono font-bold">✓ Transaksi Selesai</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AREA PROFIL TOKO */}
      {activeTab === 'store' && (
        <form onSubmit={handleStoreSubmit} className="max-w-xl p-6 rounded-2xl bg-[#151A23] border border-[#262E3D] space-y-4">
          <h2 className="text-base font-bold text-white border-b border-[#262E3D] pb-3">Pengaturan Profil Toko</h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Nama Toko *</label>
            <input
              type="text"
              required
              value={storeForm.name}
              onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Deskripsi Toko</label>
            <textarea
              rows={3}
              value={storeForm.description}
              onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
              className="w-full p-2.5 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">URL Logo Toko (Gambar Internet)</label>
            <input
              type="url"
              value={storeForm.logoUrl}
              onChange={(e) => setStoreForm({ ...storeForm, logoUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-2.5 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#00F0FF] text-black font-bold text-xs hover:bg-[#00F0FF]/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Simpan Perubahan Profil
          </button>
        </form>
      )}

      {/* Modal Tambah/Edit Produk */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#151A23] border border-[#262E3D] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#262E3D] pb-3">
              <h3 className="font-bold text-white text-base">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Nama Produk *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Contoh: SteelSeries Apex Pro TKL Keyboard"
                  className="w-full p-2 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Kategori *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full p-2 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white"
                  >
                    {data.categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Brand *</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="Contoh: Razer, Logitech, SteelSeries"
                    className="w-full p-2 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Harga (IDR) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="1500000"
                    className="w-full p-2 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Stok Barang *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="25"
                    className="w-full p-2 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">URL Gambar (Internet API/CDN) *</label>
                <input
                  type="url"
                  required
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Deskripsi & Spek</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Jelaskan switch, sensor, polling rate..."
                  className="w-full p-2 rounded-lg bg-[#0B0E14] border border-[#262E3D] text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={productForm.isFeatured}
                  onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                  className="rounded bg-[#0B0E14] border-[#262E3D] text-[#00F0FF]"
                />
                <label htmlFor="isFeatured" className="text-xs text-gray-300 font-medium">
                  Tandai sebagai Featured Drop (Tampil di Hero Homepage)
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0B0E14] text-gray-300 border border-[#262E3D] text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#00F0FF] text-black font-extrabold text-xs hover:bg-[#00F0FF]/90 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
