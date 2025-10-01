
    function showPage(pageId, el){
      document.querySelectorAll(".page").forEach(p=>p.style.display="none");
      document.getElementById(pageId).style.display="block";
      document.querySelectorAll(".navbar a").forEach(a=>a.classList.remove("active"));
      if(el) el.classList.add("active");
    }
    function goLogin(){document.getElementById("splash").style.display="none";document.getElementById("authPage").style.display="flex";}
    function showRegister(){document.getElementById("loginCard").style.display="none";document.getElementById("registerCard").style.display="block";}
    function showLogin(){document.getElementById("registerCard").style.display="none";document.getElementById("loginCard").style.display="block";}
    function login(){document.getElementById("authPage").style.display="none";document.getElementById("content").style.display="block";document.getElementById("navbar").style.display="flex";showPage('dashboard',document.querySelector(".navbar a"));initChart();}
    function register(){alert("Akun berhasil dibuat! Silakan login.");showLogin();}
    function tambahPemasukan(){let s=document.getElementById("sumberIn").value;let j=document.getElementById("jumlahIn").value;if(s&&j){let row=`<tr><td>${s}</td><td>Rp ${parseInt(j).toLocaleString()}</td></tr>`;document.getElementById("tabelPemasukan").innerHTML+=row;document.getElementById("sumberIn").value="";document.getElementById("jumlahIn").value="";}}
    function tambahPengeluaran(){let s=document.getElementById("sumberOut").value;let j=document.getElementById("jumlahOut").value;if(s&&j){let row=`<tr><td>${s}</td><td>Rp ${parseInt(j).toLocaleString()}</td></tr>`;document.getElementById("tabelPengeluaran").innerHTML+=row;document.getElementById("sumberOut").value="";document.getElementById("jumlahOut").value="";}}
    function initChart(){const ctx=document.getElementById('chart').getContext('2d');new Chart(ctx,{type:'bar',data:{labels:['Jan','Feb','Mar','Apr'],datasets:[{label:'Pemasukan',data:[12000000,10500000,11500000,13000000],backgroundColor:'rgba(46,204,113,0.7)'},{label:'Pengeluaran',data:[8500000,7200000,9500000,9000000],backgroundColor:'rgba(231,76,60,0.7)'}]},options:{responsive:true,plugins:{legend:{position:'top'}}}});}
    function printLaporan(){window.print();}
    function showLaporan(type,el){
      document.querySelectorAll("#laporan .tabs button").forEach(b=>b.classList.remove("active"));
      el.classList.add("active");
      document.getElementById("lapHarian").style.display="none";
      document.getElementById("lapBulanan").style.display="none";
      document.getElementById("lapTahunan").style.display="none";
      document.getElementById("lap"+type.charAt(0).toUpperCase()+type.slice(1)).style.display="block";
    }
