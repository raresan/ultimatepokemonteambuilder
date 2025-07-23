export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='flex flex-col items-center gap-2 p-10 bg-zekrom'>
      <p>If you want to support this project, consider donating here.</p>
      <p>Found any bugs? Please, open an issue in GitHub.</p>
      <p>© of Azuxo Studio, 2025-{currentYear}</p>
      <p>Pokémon is © of Nintendo, 1995-{currentYear}</p>
    </footer>
  )
}
