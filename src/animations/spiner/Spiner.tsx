import "./spinner.css"

type SpinerProps = {
  color: string,
  size: number
}

const Spiner = ({ color, size }: SpinerProps) => {

  const styles = {
    borderTopColor: color,
    borderBottomColor: color,
    width: `${size}px`,
    minHeight: `${size}px`
  }

  return (
    <div 
      className={`spinner mx-auto my-8`}
      style={styles}
    >
    </div>
  )
}

export default Spiner