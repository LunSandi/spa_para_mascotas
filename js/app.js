        let mascotas = []; 
        let carrito = [];  

        function handleLogin(e) {
            e.preventDefault();
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            if (u === 'admin' && p === '1234') {
                document.getElementById('view-login').classList.add('hidden');
                document.getElementById('main-header').classList.remove('hidden');
                document.getElementById('login-error').style.display = 'none';
                router('registro'); 
            } else {
                document.getElementById('login-error').style.display = 'block';
            }
        }

        function logout() { location.reload(); }

        function router(viewName) {
            ['registro', 'agenda', 'tienda'].forEach(v => {
                document.getElementById(`view-${v}`).classList.add('hidden');
                const btn = document.getElementById(`nav-${v}`);
                if(btn) btn.classList.remove('active-nav');
            });
            document.getElementById(`view-${viewName}`).classList.remove('hidden');
            document.getElementById(`nav-${viewName}`).classList.add('active-nav');
            
            if (viewName === 'agenda') actualizarSelectMascotas();
            if (viewName === 'tienda') renderCatalogo();
        }

        function registrarDueno(e) {
            e.preventDefault(); alert("Propietario guardado."); e.target.reset();
        }
        function registrarMascota(e) {
            e.preventDefault();
            const n = document.getElementById('m-nombre').value;
            if(n) { mascotas.push(n); alert(`Mascota "${n}" registrada.`); e.target.reset(); }
        }

        function actualizarSelectMascotas() {
            const s = document.getElementById('a-mascota');
            s.innerHTML = '<option value="">Seleccione...</option>';
            if(mascotas.length === 0) s.querySelector('option').text = "No hay mascotas registradas";
            mascotas.forEach(m => {
                const o = document.createElement('option'); o.value=m; o.text="🐾 "+m; s.appendChild(o);
            });
        }
        function agendarServicio(e) {
            e.preventDefault();
            const m = document.getElementById('agenda-success');
            m.style.display='block'; setTimeout(()=>{m.style.display='none';e.target.reset();},3000);
        }

        function renderCatalogo() {
            const c = document.getElementById('catalog-container');
            if(c.innerHTML.trim() !== "") return;
            productos.forEach(p => {
                c.innerHTML += `
                    <div class="product-card">
                        <div class="product-img-container"><img src="${p.imagen}" alt="${p.nombre}"></div>
                        <div class="product-info">
                            <h3>${p.nombre}</h3>
                            <span class="price">Bs${p.precio.toFixed(2)}</span>
                            <button class="btn-primary" onclick="agregarAlCarrito(${p.id})">Agregar +</button>
                        </div>
                    </div>`;
            });
        }

        function agregarAlCarrito(id) {
            carrito.push({...productos.find(p=>p.id===id)});
            renderCarrito();
        }

        function eliminarDelCarrito(index) {
            carrito.splice(index, 1);
            renderCarrito();
        }

        function renderCarrito() {
            const c = document.getElementById('cart-items');
            c.innerHTML = '';
            if (carrito.length === 0) c.innerHTML = '<p style="color:#777;text-align:center;padding:20px;">Tu carrito está vacío.</p>';
            
            let sub = 0;
            carrito.forEach((item, i) => {
                sub += item.precio;
                c.innerHTML += `
                    <div class="cart-item">
                        <div style="display:flex;align-items:center;">
                            <img src="${item.imagen}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;margin-right:10px;">
                            <span>${item.nombre}</span>
                        </div>
                        <div>
                            <strong>$${item.precio.toFixed(2)}</strong>
                            <button class="btn-danger" style="margin-left:10px;" onclick="eliminarDelCarrito(${i})">X</button>
                        </div>
                    </div>`;
            });
            document.getElementById('cart-total').innerText = (sub).toFixed(2);
        }
        function finalizarCompra() {
            if (carrito.length === 0) {
                alert("El carrito está vacío. Por favor agrega productos antes de pagar.");
                return;
            }

            const total = document.getElementById('cart-total').innerText;
            
            const confirmacion = confirm(`¿Deseas procesar el pago por un total de Bs${total}?`);

            if (confirmacion) {
                alert("¡Pago realizado con éxito!\n\nGracias por su compra. Se ha generado la orden.");
                carrito = [];
                renderCarrito();
            }
        }