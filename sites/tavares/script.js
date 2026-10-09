const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const serviceData=[
 ['Clássico','Definição delicada e acabamento natural.','R$ 120','ASSINATURA','assets/lash-1.jpg',60],
 ['Volume Brasileiro','Presença na medida certa, com leveza.','R$ 150','MAIS PEDIDO','assets/lash-2.jpg',75],
 ['Volume Híbrido','Textura e definição para um olhar marcante.','R$ 140','EQUILÍBRIO','assets/lash-1.jpg',70],
 ['Volume Egípcio','Curvatura sofisticada e presença elegante.','R$ 160','MARCANTE','assets/lash-2.jpg',80],
 ['Mega Volume','Densidade e impacto para um resultado poderoso.','R$ 180','GLAM','assets/lash-1.jpg',90],
 ['Manutenção','Renove seu conjunto e mantenha o olhar impecável.','R$ 90','CUIDADO','assets/lash-2.jpg',45],
 ['Lash Lifting','Curvatura elegante para realçar seus próprios fios.','R$ 100','NATURAL','assets/lash-1.jpg',50]
];
const carousel=$('#carousel');
serviceData.forEach((s,i)=>{const c=document.createElement('article');c.className='service-card';c.innerHTML=`<div class="service-photo"><img src="${s[4]}" alt="${s[0]}"></div><div class="service-body"><span>0${i+1} · ${s[3]}</span><h3>${s[0]}</h3><p>${s[1]}</p><div class="service-foot"><strong>${s[2]}</strong><button data-index="${i}">Agendar ↗</button></div></div>`;carousel.appendChild(c)});
const cards=$$('.service-card');let active=0,startX=0,drag=false;
function render(){const n=cards.length;cards.forEach((c,i)=>{let d=(i-active+n)%n;if(d>n/2)d-=n;const ad=Math.abs(d);const x=d*218;const rot=d===0?0:d*11;const z=ad===0?80:40-ad*10;const scale=ad===0?1:ad===1?.74:ad===2?.57:.46;const opacity=ad>3?.03:ad===0?1:ad===1?.7:ad===2?.34:.08;c.classList.toggle('active',ad===0);c.style.transform=`translateX(calc(-50% + ${x}px)) translateZ(${-ad*125}px) rotateY(${rot}deg) scale(${scale})`;c.style.opacity=opacity;c.style.zIndex=z;c.style.filter=ad>2?'blur(2px)':'none';});$('#counter').textContent=String(active+1).padStart(2,'0');$('#progress').style.width=((active+1)/n*100)+'%';$('#activeServiceName').textContent=serviceData[active][0];$('#activeServiceMeta').textContent=serviceData[active][1]}
function move(dir){active=(active+dir+cards.length)%cards.length;render()}
$('#next').onclick=()=>move(1);$('#prev').onclick=()=>move(-1);
cards.forEach((c,i)=>{c.addEventListener('click',e=>{if(e.target.closest('button'))return;if(i!==active){active=i;render()}});c.querySelector('button').onclick=e=>{e.stopPropagation();openBook(serviceData[i])}});
carousel.addEventListener('pointerdown',e=>{startX=e.clientX;drag=true;carousel.setPointerCapture(e.pointerId)});carousel.addEventListener('pointerup',e=>{if(!drag)return;const dx=e.clientX-startX;if(Math.abs(dx)>35)move(dx<0?1:-1);drag=false});carousel.addEventListener('pointercancel',()=>drag=false);render();
const booking=$('#booking'),options=$('#serviceOptions');let selected=null,selectedTime='',whatsappMessage='';
serviceData.forEach((s,i)=>{const b=document.createElement('button');b.className='service-option';b.innerHTML=`<em>0${i+1}</em><b>${s[0]}</b><strong>${s[2]}</strong>`;b.onclick=()=>selectService(s,b);options.appendChild(b)});
function selectService(s,button){selected={name:s[0],price:s[2],deposit:s[5]};$$('.service-option').forEach(x=>x.classList.remove('selected'));button.classList.add('selected');$('#selectedLabel').textContent=s[0];$('#selectedPrice').textContent=s[2];$('#finalService').textContent=s[0];$('#finalPrice').textContent=s[2];$('#depositService').textContent=s[0];$('#paymentServicePrice').textContent=s[2];$('#depositValue').textContent='R$ '+s[5].toFixed(2).replace('.',',')}

function openBook(service){booking.classList.add('open');booking.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';if(service){const idx=serviceData.findIndex(s=>s[0]===service.name);selectService(serviceData[idx],options.children[idx])}else if(selected){const idx=serviceData.findIndex(s=>s[0]===selected.name);if(idx>=0)selectService(serviceData[idx],options.children[idx])}show('#step1');setProgress(1)}
function closeBook(){booking.classList.remove('open');booking.setAttribute('aria-hidden','true');document.body.style.overflow=''}
$$('[data-open-booking]').forEach(b=>b.onclick=()=>openBook());$$('[data-close]').forEach(b=>b.onclick=closeBook);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBook()});
function show(id){$$('.book-step').forEach(x=>x.classList.add('hidden'));$(id).classList.remove('hidden')}
function setProgress(n){$$('.booking-progress>div').forEach((x,i)=>x.classList.toggle('active',i===n-1))}
$('#toStep2').onclick=()=>{if(!selected){alert('Escolha um procedimento para continuar.');return}show('#step2');setProgress(2)};
$('#back1').onclick=()=>{show('#step1');setProgress(1)};
const date=$('#date');const today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());date.min=today.toISOString().slice(0,10);
const times=['08:00','09:30','11:00','13:30','15:00','16:30','18:00','19:30'];function paintTimes(){const box=$('#times');box.innerHTML='';times.forEach(t=>{const b=document.createElement('button');b.textContent=t;b.onclick=()=>{selectedTime=t;$$('#times button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')};box.appendChild(b)})}paintTimes();
$('#toStep3').onclick=()=>{const name=$('#name').value.trim(),phone=$('#phone').value.trim();if(!name||!phone){alert('Preencha seu nome e WhatsApp.');return}show('#step3');setProgress(3)};
$('#back2').onclick=()=>{show('#step2');setProgress(2)};
$('#toStep4').onclick=()=>{if(!date.value||!selectedTime){alert('Escolha a data e o horário.');return}const msg=['Olá, Studio Tavares! ✨','','Gostaria de solicitar um horário.','',`*Procedimento:* ${selected.name}`,`*Valor:* ${selected.price}`,`*Sinal de 50%:* R$ ${selected.deposit.toFixed(2).replace('.',',')}`,`*Data:* ${date.value.split('-').reverse().join('/')}`,`*Horário:* ${selectedTime}`,`*Nome:* ${$('#name').value.trim()}`,`*WhatsApp:* ${$('#phone').value.trim()}`,`*Observação:* ${$('#note').value.trim()||'Nenhuma'}`,'','*Aviso:* Estou ciente de que preciso enviar o comprovante do sinal de 50% para que o agendamento seja confirmado.'].join('\n');whatsappMessage=msg;show('#step4');setProgress(4);requestAnimationFrame(()=>$('#booking-panel')?.scrollTo({top:0,behavior:'smooth'}))};
$('#back3').onclick=()=>{show('#step3');setProgress(3)};
$('#sendReceipt').onclick=()=>{if(!whatsappMessage){alert('Finalize o preenchimento do agendamento primeiro.');return}window.open('https://wa.me/5585994172721?text='+encodeURIComponent(whatsappMessage),'_blank')};
