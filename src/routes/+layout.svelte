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

<footer class="footer items-center p-4 bg-neutral text-neutral-content fixed bottom-0">
  <div class="items-center grid-flow-col">
    <p>Copyright ToldJS © 2023 - CVR: 43902113</p>
  </div> 
  <div class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
    <a href="https://discord.gg/DM542T9mqZ"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 127.14 96.36"  class="fill-current"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"></path></svg></a>
  </div>
</footer>