<script>
	import '../app.css';
</script>

<div class="navbar bg-base-100">
	<div class="navbar-start">
		<div class="dropdown dropdown-bottom">
			<label tabindex="0" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/></svg
				>
			</label>
			<ul
				tabindex="0"
				class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-neutral rounded-box w-52"
			>
				<li><a href="/generator">Generator</a></li>
				<li><a href="/om-os">Om Projektet</a></li>
				<li><a href="https://github.com/ToldJS/ToldJS/issues/new" target="_blank" rel="noreferrer">Rapporter en fejl</a></li>
				<li><a class="bg-primary text-base-100" href="/kontakt-os">Kontakt os</a></li>
			</ul>
		</div>
		<a href="/" class="btn btn-ghost"
		><img class="h-14" src="/ToldJS_White.png" alt="ToldJS Logo" /></a>
	</div>
	<div class="navbar-center">

	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/generator">Generator</a></li>
			<li><a href="/om-os">Om Projektet</a></li>
		</ul>
			
	</div>
	<div class="navbar-end hidden lg:flex"> 
		<ul class="menu menu-horizontal px-1">
			<li><a href="https://github.com/ToldJS/ToldJS/issues/new" target="_blank" rel="noreferrer">Rapporter en fejl</a></li>
			<li><a class="bg-primary text-base-100" href="/kontakt-os">Kontakt os</a></li>
		</ul>
	</div>
</div>

<div class="container mx-auto prose">
	<slot />
</div>

<footer class="footer footer-center p-4 bg-base-300 text-base-content">
  <div>
    <p>CVR nr: 43902113</p>
  </div>
</footer>