// // // // // import { useEffect, useState } from 'react';
// // // // // import { resourcesApi } from '../../api/resources';

// // // // // export default function AdminResources() {
// // // // //   const [resources, setResources] = useState([]);
// // // // //   useEffect(() => {
// // // // //     resourcesApi.getAll().then(res => setResources(res.data.data)).catch(() => {});
// // // // //   }, []);

// // // // //   return (
// // // // //     <div>
// // // // //       <h1 className="text-2xl font-bold mb-4">Resources</h1>
// // // // //       <table className="w-full border">
// // // // //         <thead>
// // // // //           <tr className="bg-gray-100">
// // // // //             <th className="p-2">Name</th>
// // // // //             <th className="p-2">Type</th>
// // // // //             <th className="p-2">Capacity</th>
// // // // //             <th className="p-2">Status</th>
// // // // //           </tr>
// // // // //         </thead>
// // // // //         <tbody>
// // // // //           {resources.map(r => (
// // // // //             <tr key={r.id} className="border-t">
// // // // //               <td className="p-2">{r.name}</td>
// // // // //               <td className="p-2">{r.type}</td>
// // // // //               <td className="p-2">{r.capacity}</td>
// // // // //               <td className="p-2">{r.status}</td>
// // // // //             </tr>
// // // // //           ))}
// // // // //         </tbody>
// // // // //       </table>
// // // // //     </div>
// // // // //   )
// // // // // }

// // // // import { useEffect, useState } from 'react';
// // // // import { resourcesApi } from '../../api/resources';

// // // // export default function AdminResources() {
// // // //   const [resources, setResources] = useState([]);

// // // //   const fetchResources = async () => {
// // // //     const res = await resourcesApi.getAll();
// // // //     setResources(res.data.data);
// // // //   }

// // // //   useEffect(() => { fetchResources() }, []);

// // // //   return (
// // // //     <div className="p-6">
// // // //       <h1 className="text-2xl font-bold mb-4">Manage Resources</h1>
// // // //       <div className="overflow-x-auto">
// // // //         <table className="w-full border border-gray-200 rounded-lg">
// // // //           <thead className="bg-gray-100 text-left">
// // // //             <tr>
// // // //               <th className="p-2 border-b">Image</th>
// // // //               <th className="p-2 border-b">Name</th>
// // // //               <th className="p-2 border-b">Type</th>
// // // //               <th className="p-2 border-b">Capacity</th>
// // // //               <th className="p-2 border-b">Status</th>
// // // //             </tr>
// // // //           </thead>
// // // //           <tbody>
// // // //             {resources.map(r => (
// // // //               <tr key={r.id} className="border-b hover:bg-gray-50">
// // // //                 <td className="p-2">
// // // //                   {r.imageUrl ? <img src={r.imageUrl} alt={r.name} className="h-12 w-12 object-cover rounded" /> : 'No Image'}
// // // //                 </td>
// // // //                 <td className="p-2">{r.name}</td>
// // // //                 <td className="p-2">{r.type}</td>
// // // //                 <td className="p-2">{r.capacity}</td>
// // // //                 <td className="p-2">{r.status}</td>
// // // //               </tr>
// // // //             ))}
// // // //           </tbody>
// // // //         </table>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }

// // // //frontend/src/api/notifications.js
// // // import { useEffect, useState } from 'react';
// // // import axios from 'axios';

// // // export default function AdminResources() {
// // //   const [resources, setResources] = useState([]);
// // //   const [form, setForm] = useState({
// // //     id: null,
// // //     name: '',
// // //     type: '',
// // //     capacity: '',
// // //     status: 'AVAILABLE',
// // //     description: '',
// // //     location: '',
// // //     imageUrl: ''
// // //   });
// // //   const [file, setFile] = useState(null);

// // //   const fetchResources = async () => {
// // //     try {
// // //       const res = await axios.get('/api/resources');
// // //       setResources(res.data);
// // //     } catch (err) {
// // //       console.error(err);
// // //       alert('Failed to fetch resources');
// // //     }
// // //   };

// // //   useEffect(() => { fetchResources(); }, []);

// // //   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
// // //   const handleFileChange = e => setFile(e.target.files[0]);

// // //   const uploadImage = async () => {
// // //     if (!file) return form.imageUrl || '';
// // //     const formData = new FormData();
// // //     formData.append('file', file);
// // //     const res = await axios.post('/api/resources/upload', formData, {
// // //       headers: { 'Content-Type': 'multipart/form-data' }
// // //     });
// // //     return res.data; // uploaded file URL
// // //   };

// // //   const handleSubmit = async e => {
// // //     e.preventDefault();
// // //     try {
// // //       const imageUrl = await uploadImage();
// // //       const payload = { ...form, imageUrl };

// // //       if (form.id) {
// // //         await axios.put(`/api/resources/${form.id}`, payload);
// // //       } else {
// // //         await axios.post(`/api/resources`, payload);
// // //       }

// // //       setForm({ id: null, name: '', type: '', capacity: '', status: 'AVAILABLE', description: '', location: '', imageUrl: '' });
// // //       setFile(null);
// // //       fetchResources();
// // //     } catch (err) {
// // //       console.error(err);
// // //       alert('Error: ' + (err.response?.data?.message || err.message));
// // //     }
// // //   };

// // //   const handleEdit = r => setForm({ ...r, type: r.type || '' });
// // //   const handleDelete = async id => {
// // //     if (window.confirm('Delete this resource?')) {
// // //       await axios.delete(`/api/resources/${id}`);
// // //       fetchResources();
// // //     }
// // //   };

// // //   return (
// // //     <div className="p-6">
// // //       <h1 className="text-2xl font-bold mb-4">Manage Resources</h1>

// // //       <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
// // //         <div className="flex gap-4 flex-wrap">
// // //           <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded" required />
// // //           <select name="type" value={form.type} onChange={handleChange} required className="border p-2 rounded">
// // //             <option value="">Select Type</option>
// // //             <option value="LECTURE_HALL">Lecture Hall</option>
// // //             <option value="LAB">Lab</option>
// // //             <option value="MEETING_ROOM">Meeting Room</option>
// // //             <option value="EQUIPMENT">Equipment</option>
// // //           </select>
// // //           <input type="number" name="capacity" placeholder="Capacity" value={form.capacity} onChange={handleChange} className="border p-2 rounded" required />
// // //           <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded">
// // //             <option value="AVAILABLE">AVAILABLE</option>
// // //             <option value="UNAVAILABLE">UNAVAILABLE</option>
// // //           </select>
// // //           <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} className="border p-2 rounded" />
// // //           <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded" />
// // //           <input type="file" onChange={handleFileChange} className="border p-2 rounded" />
// // //           <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{form.id ? 'Update' : 'Create'}</button>
// // //         </div>
// // //       </form>

// // //       <div className="overflow-x-auto">
// // //         <table className="w-full border border-gray-200 rounded-lg">
// // //           <thead className="bg-gray-100 text-left">
// // //             <tr>
// // //               <th className="p-2 border-b">Image</th>
// // //               <th className="p-2 border-b">Name</th>
// // //               <th className="p-2 border-b">Type</th>
// // //               <th className="p-2 border-b">Capacity</th>
// // //               <th className="p-2 border-b">Status</th>
// // //               <th className="p-2 border-b">Actions</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {resources.map(r => (
// // //               <tr key={r.id} className="border-b hover:bg-gray-50">
// // //                 <td className="p-2">{r.imageUrl ? <img src={r.imageUrl} alt={r.name} className="h-12 w-12 object-cover rounded" /> : 'No Image'}</td>
// // //                 <td className="p-2">{r.name}</td>
// // //                 <td className="p-2">{r.type}</td>
// // //                 <td className="p-2">{r.capacity}</td>
// // //                 <td className="p-2">{r.status}</td>
// // //                 <td className="p-2 flex gap-2">
// // //                   <button onClick={() => handleEdit(r)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
// // //                   <button onClick={() => handleDelete(r.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
// // //                 </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import { useEffect, useState } from 'react';
// // import axios from 'axios';

// // export default function AdminResources() {
// //   const [resources, setResources] = useState([]);
// //   const [form, setForm] = useState({
// //     id: null,
// //     name: '',
// //     type: '',
// //     capacity: '',
// //     status: 'AVAILABLE',
// //     description: '',
// //     location: '',
// //     imageUrl: ''
// //   });
// //   const [file, setFile] = useState(null);
// //   const [preview, setPreview] = useState({ open: false, src: '' });

// //   const fetchResources = async () => {
// //     try {
// //       const res = await axios.get('/api/resources');
// //       setResources(res.data);
// //     } catch (err) {
// //       console.error(err);
// //       alert('Failed to fetch resources');
// //     }
// //   };

// //   useEffect(() => { fetchResources(); }, []);

// //   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
// //   const handleFileChange = e => setFile(e.target.files[0]);

// //   const uploadImage = async () => {
// //     if (!file) return form.imageUrl || '';
// //     const formData = new FormData();
// //     formData.append('file', file);
// //     const res = await axios.post('/api/resources/upload', formData, {
// //       headers: { 'Content-Type': 'multipart/form-data' }
// //     });
// //     return res.data; // uploaded file URL
// //   };

// //   const handleSubmit = async e => {
// //     e.preventDefault();
// //     try {
// //       const imageUrl = await uploadImage();

// //       const isEquipment = form.type === 'EQUIPMENT';
// //       const payload = {
// //         ...form,
// //         imageUrl,
// //         // for equipment: store quantity in capacity, null out location
// //         capacity: isEquipment ? Number(form.capacity) || 0 : (form.capacity ? Number(form.capacity) : null),
// //         location: isEquipment ? null : form.location || null
// //       };

// //       if (form.id) {
// //         await axios.put(`/api/resources/${form.id}`, payload);
// //       } else {
// //         await axios.post(`/api/resources`, payload);
// //       }

// //       setForm({ id: null, name: '', type: '', capacity: '', status: 'AVAILABLE', description: '', location: '', imageUrl: '' });
// //       setFile(null);
// //       fetchResources();
// //     } catch (err) {
// //       console.error(err);
// //       alert('Error: ' + (err.response?.data?.message || err.message));
// //     }
// //   };

// //   const handleEdit = r => setForm({
// //     id: r.id,
// //     name: r.name,
// //     type: r.type || '',
// //     capacity: r.capacity ?? '',
// //     status: r.status || 'AVAILABLE',
// //     description: r.description || '',
// //     location: r.location || '',
// //     imageUrl: r.imageUrl || ''
// //   });

// //   const handleDelete = async id => {
// //     if (window.confirm('Delete this resource?')) {
// //       await axios.delete(`/api/resources/${id}`);
// //       fetchResources();
// //     }
// //   };

// //   const isEquipment = form.type === 'EQUIPMENT';

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold mb-4">Manage Resources</h1>

// //       <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50 space-y-3">
// //         <div className="flex gap-4 flex-wrap">
// //           <input
// //             type="text"
// //             name="name"
// //             placeholder="Name"
// //             value={form.name}
// //             onChange={handleChange}
// //             className="border p-2 rounded"
// //             required
// //           />

// //           <select
// //             name="type"
// //             value={form.type}
// //             onChange={handleChange}
// //             required
// //             className="border p-2 rounded"
// //           >
// //             <option value="">Select Type</option>
// //             <option value="LECTURE_HALL">Lecture Hall</option>
// //             <option value="LAB">Lab</option>
// //             <option value="MEETING_ROOM">Meeting Room</option>
// //             <option value="EQUIPMENT">Equipment</option>
// //           </select>

// //           <input
// //             type="number"
// //             name="capacity"
// //             placeholder={isEquipment ? "Quantity" : "Capacity"}
// //             value={form.capacity}
// //             onChange={handleChange}
// //             className="border p-2 rounded"
// //             required
// //           />

// //           <select
// //             name="status"
// //             value={form.status}
// //             onChange={handleChange}
// //             className="border p-2 rounded"
// //           >
// //             <option value="AVAILABLE">AVAILABLE</option>
// //             <option value="UNAVAILABLE">UNAVAILABLE</option>
// //             <option value="MAINTENANCE">MAINTENANCE</option>
// //           </select>

// //           {!isEquipment && (
// //             <input
// //               type="text"
// //               name="location"
// //               placeholder="Location"
// //               value={form.location}
// //               onChange={handleChange}
// //               className="border p-2 rounded"
// //             />
// //           )}

// //           <input
// //             type="text"
// //             name="description"
// //             placeholder="Description"
// //             value={form.description}
// //             onChange={handleChange}
// //             className="border p-2 rounded w-full"
// //           />

// //           <div className="flex items-center gap-3">
// //             <input type="file" onChange={handleFileChange} className="border p-2 rounded" />
// //             {form.imageUrl && (
// //               <img
// //                 src={form.imageUrl}
// //                 alt="preview"
// //                 className="h-12 w-12 object-cover rounded border cursor-pointer"
// //                 onClick={() => setPreview({ open: true, src: form.imageUrl })}
// //               />
// //             )}
// //           </div>

// //           <button
// //             type="submit"
// //             className="bg-blue-500 text-white px-4 py-2 rounded"
// //           >
// //             {form.id ? 'Update' : 'Create'}
// //           </button>
// //         </div>
// //       </form>

// //       <div className="overflow-x-auto">
// //         <table className="w-full border border-gray-200 rounded-lg">
// //           <thead className="bg-gray-100 text-left">
// //             <tr>
// //               <th className="p-2 border-b">Image</th>
// //               <th className="p-2 border-b">Name</th>
// //               <th className="p-2 border-b">Type</th>
// //               <th className="p-2 border-b">{/* Capacity header adapts */}
// //                 {isEquipment ? "Quantity" : "Capacity"}
// //               </th>
// //               <th className="p-2 border-b">Status</th>
// //               <th className="p-2 border-b">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {resources.map(r => (
// //               <tr key={r.id} className="border-b hover:bg-gray-50">
// //                 <td className="p-2">
// //                   {r.imageUrl ? (
// //                     <img
// //                       src={r.imageUrl}
// //                       alt={r.name}
// //                       className="h-12 w-12 object-cover rounded cursor-pointer border"
// //                       onClick={() => setPreview({ open: true, src: r.imageUrl })}
// //                     />
// //                   ) : (
// //                     'No Image'
// //                   )}
// //                 </td>
// //                 <td className="p-2">{r.name}</td>
// //                 <td className="p-2">{r.type}</td>
// //                 <td className="p-2">{r.capacity}</td>
// //                 <td className="p-2">{r.status}</td>
// //                 <td className="p-2 flex gap-2">
// //                   <button onClick={() => handleEdit(r)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
// //                   <button onClick={() => handleDelete(r.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* Image Preview Modal */}
// //       {preview.open && (
// //         <div
// //           className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
// //           onClick={() => setPreview({ open: false, src: '' })}
// //         >
// //           <img
// //             src={preview.src}
// //             alt="full"
// //             className="max-h-[80vh] max-w-[90vw] object-contain rounded shadow-2xl border border-white"
// //             onClick={(e) => e.stopPropagation()}
// //           />
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const BASE_URL = 'http://localhost:8083'; // match user page

// export default function AdminResources() {
//   const [resources, setResources] = useState([]);
//   const [form, setForm] = useState({
//     id: null,
//     name: '',
//     type: '',
//     capacity: '',
//     status: 'AVAILABLE',
//     description: '',
//     location: '',
//     imageUrl: ''
//   });
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState({ open: false, src: '' });

//   const fetchResources = async () => {
//     try {
//       const res = await axios.get('/api/resources');
//       setResources(res.data);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to fetch resources');
//     }
//   };

//   useEffect(() => { fetchResources(); }, []);

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
//   const handleFileChange = e => setFile(e.target.files[0]);

//   const uploadImage = async () => {
//     if (!file) return form.imageUrl || '';
//     const formData = new FormData();
//     formData.append('file', file);
//     const res = await axios.post('/api/resources/upload', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     return res.data; // uploaded file URL (e.g., "/uploads/xxx")
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     try {
//       const imageUrl = await uploadImage();

//       const isEquipment = form.type === 'EQUIPMENT';
//       const payload = {
//         ...form,
//         imageUrl,
//         capacity: isEquipment ? Number(form.capacity) || 0 : (form.capacity ? Number(form.capacity) : null),
//         location: isEquipment ? null : form.location || null
//       };

//       if (form.id) {
//         await axios.put(`/api/resources/${form.id}`, payload);
//       } else {
//         await axios.post(`/api/resources`, payload);
//       }

//       setForm({ id: null, name: '', type: '', capacity: '', status: 'AVAILABLE', description: '', location: '', imageUrl: '' });
//       setFile(null);
//       fetchResources();
//     } catch (err) {
//       console.error(err);
//       alert('Error: ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleEdit = r => setForm({
//     id: r.id,
//     name: r.name,
//     type: r.type || '',
//     capacity: r.capacity ?? '',
//     status: r.status || 'AVAILABLE',
//     description: r.description || '',
//     location: r.location || '',
//     imageUrl: r.imageUrl || ''
//   });

//   const handleDelete = async id => {
//     if (window.confirm('Delete this resource?')) {
//       await axios.delete(`/api/resources/${id}`);
//       fetchResources();
//     }
//   };

//   const isEquipment = form.type === 'EQUIPMENT';

//   const fullImg = (path) => path?.startsWith('http') ? path : `${BASE_URL}${path}`;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Manage Resources</h1>

//       <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50 space-y-3">
//         <div className="flex gap-4 flex-wrap">
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={form.name}
//             onChange={handleChange}
//             className="border p-2 rounded"
//             required
//           />

//           <select
//             name="type"
//             value={form.type}
//             onChange={handleChange}
//             required
//             className="border p-2 rounded"
//           >
//             <option value="">Select Type</option>
//             <option value="LECTURE_HALL">Lecture Hall</option>
//             <option value="LAB">Lab</option>
//             <option value="MEETING_ROOM">Meeting Room</option>
//             <option value="EQUIPMENT">Equipment</option>
//           </select>

//           <input
//             type="number"
//             name="capacity"
//             placeholder={isEquipment ? "Quantity" : "Capacity"}
//             value={form.capacity}
//             onChange={handleChange}
//             className="border p-2 rounded"
//             required
//           />

//           <select
//             name="status"
//             value={form.status}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           >
//             <option value="AVAILABLE">AVAILABLE</option>
//             <option value="UNAVAILABLE">UNAVAILABLE</option>
//             <option value="MAINTENANCE">MAINTENANCE</option>
//           </select>

//           {!isEquipment && (
//             <input
//               type="text"
//               name="location"
//               placeholder="Location"
//               value={form.location}
//               onChange={handleChange}
//               className="border p-2 rounded"
//             />
//           )}

//           <input
//             type="text"
//             name="description"
//             placeholder="Description"
//             value={form.description}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//           />

//           <div className="flex items-center gap-3">
//             <input type="file" onChange={handleFileChange} className="border p-2 rounded" />
//             {form.imageUrl && (
//               <img
//                 src={fullImg(form.imageUrl)}
//                 alt="preview"
//                 className="h-12 w-12 object-cover rounded border cursor-pointer"
//                 onClick={() => setPreview({ open: true, src: fullImg(form.imageUrl) })}
//               />
//             )}
//           </div>

//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             {form.id ? 'Update' : 'Create'}
//           </button>
//         </div>
//       </form>

//       <div className="overflow-x-auto">
//         <table className="w-full border border-gray-200 rounded-lg">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-2 border-b">Image</th>
//               <th className="p-2 border-b">Name</th>
//               <th className="p-2 border-b">Type</th>
//               <th className="p-2 border-b">{isEquipment ? "Quantity" : "Capacity"}</th>
//               <th className="p-2 border-b">Status</th>
//               <th className="p-2 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {resources.map(r => (
//               <tr key={r.id} className="border-b hover:bg-gray-50">
//                 <td className="p-2">
//                   {r.imageUrl ? (
//                     <img
//                       src={fullImg(r.imageUrl)}
//                       alt={r.name}
//                       className="h-12 w-12 object-cover rounded cursor-pointer border"
//                       onClick={() => setPreview({ open: true, src: fullImg(r.imageUrl) })}
//                     />
//                   ) : (
//                     'No Image'
//                   )}
//                 </td>
//                 <td className="p-2">{r.name}</td>
//                 <td className="p-2">{r.type}</td>
//                 <td className="p-2">{r.capacity}</td>
//                 <td className="p-2">{r.status}</td>
//                 <td className="p-2 flex gap-2">
//                   <button onClick={() => handleEdit(r)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
//                   <button onClick={() => handleDelete(r.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Image Preview Modal */}
//       {preview.open && (
//         <div
//           className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
//           onClick={() => setPreview({ open: false, src: '' })}
//         >
//           <img
//             src={preview.src}
//             alt="full"
//             className="max-h-[80vh] max-w-[90vw] object-contain rounded shadow-2xl border border-white"
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Upload, 
  X, 
  Image as ImageIcon, 
  MapPin, 
  Users, 
  Layers 
} from "lucide-react";

const BASE_URL = "http://localhost:8083";

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    type: "",
    capacity: "",
    status: "AVAILABLE",
    description: "",
    location: "",
    imageUrl: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState({ open: false, src: "" });

  const fetchResources = async () => {
    try {
      const res = await axios.get("/api/resources");
      setResources(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const resetForm = () => {
    setForm({ id: null, name: "", type: "", capacity: "", status: "AVAILABLE", description: "", location: "", imageUrl: "" });
    setFile(null);
  };

  const uploadImage = async () => {
    if (!file) return form.imageUrl || "";
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/api/resources/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await uploadImage();
      const isEquipment = form.type === "EQUIPMENT";
      const payload = {
        ...form,
        imageUrl,
        capacity: Number(form.capacity) || 0,
        location: isEquipment ? null : form.location || null,
      };

      if (form.id) {
        await axios.put(`/api/resources/${form.id}`, payload);
      } else {
        await axios.post(`/api/resources`, payload);
      }
      resetForm();
      fetchResources();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const isEquipment = form.type === "EQUIPMENT";
  const fullImg = (path) => path?.startsWith("http") ? path : `${BASE_URL}${path}`;

  // Badge Color Logic
  const getStatusStyle = (status) => {
    switch (status) {
      case "AVAILABLE": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "UNAVAILABLE": return "bg-rose-100 text-rose-700 border-rose-200";
      case "MAINTENANCE": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Resource Management</h1>
            <p className="text-gray-500">Configure university lecture halls, labs, and equipment</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-bold text-gray-600">
            Total: {resources.length}
          </div>
        </header>

        {/* 1. FORM CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
              {form.id ? <Pencil className="w-4 h-4 text-blue-500" /> : <Plus className="w-4 h-4 text-blue-500" />}
              {form.id ? "Edit Resource" : "Add New Resource"}
            </h2>
            {form.id && <button onClick={resetForm} className="text-xs text-gray-400 hover:text-rose-500 font-bold uppercase tracking-widest">Cancel Edit</button>}
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Hall A-101" required />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Resource Type</label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required>
                  <option value="">Select...</option>
                  <option value="LECTURE_HALL">Lecture Hall</option>
                  <option value="LAB">Lab</option>
                  <option value="MEETING_ROOM">Meeting Room</option>
                  <option value="EQUIPMENT">Equipment</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">{isEquipment ? "Quantity" : "Capacity"}</label>
                <input type="number" name="capacity" value={form.capacity} onChange={handleChange} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" required />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="UNAVAILABLE">UNAVAILABLE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              {!isEquipment && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Location</label>
                  <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Building / Floor" />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Cover Image</label>
                <div className="flex gap-2">
                  <label className="flex-1 border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 text-gray-500 text-sm py-2">
                    <Upload className="w-4 h-4" /> {file ? file.name.substring(0,10)+'...' : "Choose File"}
                    <input type="file" onChange={handleFileChange} className="hidden" />
                  </label>
                  {form.imageUrl && (
                    <img src={fullImg(form.imageUrl)} className="h-10 w-10 object-cover rounded-lg border shadow-sm cursor-pointer" onClick={() => setPreview({ open: true, src: fullImg(form.imageUrl) })} />
                  )}
                </div>
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-20" placeholder="Details about accessibility, features, etc." />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center gap-2">
                {form.id ? <><Pencil className="w-4 h-4" /> Update Resource</> : <><Plus className="w-4 h-4" /> Add Resource</>}
              </button>
            </div>
          </form>
        </div>

        {/* 2. TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Resource</th>
                  <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Specs</th>
                  <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {resources.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                          {r.imageUrl ? (
                            <img src={fullImg(r.imageUrl)} className="h-full w-full object-cover cursor-zoom-in" onClick={() => setPreview({ open: true, src: fullImg(r.imageUrl) })} />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-300"><ImageIcon className="w-6 h-6" /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{r.name}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                             <Layers className="w-3 h-3" /> {r.type.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-gray-400" /> {r.capacity} {r.type === 'EQUIPMENT' ? 'Units' : 'Seats'}
                        </div>
                        {!isEquipment && r.location && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <MapPin className="w-3.5 h-3.5" /> {r.location}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setForm(r)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => { if(window.confirm('Delete?')) axios.delete(`/api/resources/${r.id}`).then(fetchResources) }} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {preview.open && (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setPreview({ open: false, src: "" })}>
          <button className="absolute top-6 right-6 text-white hover:text-gray-300"><X className="w-8 h-8" /></button>
          <img src={preview.src} className="max-h-full max-w-full rounded-2xl shadow-2xl border-4 border-white/10" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}