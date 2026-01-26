import PropTypes from 'prop-types';
import { MdCheckCircle, MdClose } from 'react-icons/md';

const ThoughtSidebar = ({ thoughts, onClose }) => {
  if (!thoughts.length) {
    return null;
  }

  return (
    <aside className='thought-sidebar'>
      <div className='flex items-center justify-between mb-3'>
        <div className='text-xs font-semibold uppercase tracking-widest text-slate-300'>
          Model Thoughts
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-[10px] text-slate-400'>
            {thoughts.length} Trace{thoughts.length === 1 ? '' : 's'}
          </span>
          <button
            type='button'
            className='btn btn-ghost btn-xs text-slate-400 hover:text-slate-200'
            onClick={onClose}
            aria-label='Close thoughts panel'>
            <MdClose size={14} />
          </button>
        </div>
      </div>
      <div className='flex flex-col gap-3 overflow-y-auto pr-1 h-[calc(100%-2rem)]'>
        {thoughts.map((thought, index) => (
          <div key={thought.id} className='thought-card thought-pop'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-[11px] uppercase tracking-wider text-slate-400'>
                Trace {index + 1}
              </p>
              {thought.done ? (
                <span className='flex items-center gap-1 text-xs text-emerald-300'>
                  <MdCheckCircle /> Done
                </span>
              ) : (
                <span className='text-xs text-amber-300'>Streaming</span>
              )}
            </div>
            <div className='text-sm leading-relaxed whitespace-pre-wrap text-slate-100'>
              {thought.content || '...'}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

ThoughtSidebar.propTypes = {
  thoughts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string,
      done: PropTypes.bool,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ThoughtSidebar;
