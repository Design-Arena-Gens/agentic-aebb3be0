"use client";

import { useState } from 'react';
import type { GenerationResult, GenerateInput } from '../types';

const defaultPayload: GenerateInput = {
  topic: 'Neural Networks Basics',
  durationMinutes: 5,
  style: 'educational',
  audience: 'beginner',
  tone: 'friendly',
  language: 'en'
};

function Copy({ text }: { text: string }) {
  return (
    <button className="copy" onClick={() => navigator.clipboard.writeText(text)}>Copy</button>
  );
}

export default function Page() {
  const [payload, setPayload] = useState<GenerateInput>({ ...defaultPayload });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e?.message ?? 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header__title">Agentic Video Generator</div>
        <span className="badge">Idea &gt; Script &gt; Images &gt; VO &gt; Editing &gt; Meta</span>
      </div>
      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <label className="label">Topic</label>
          <input className="input" value={payload.topic} onChange={e => setPayload(p => ({ ...p, topic: e.target.value }))} placeholder="e.g., Neural Networks Basics" />
          <div className="row" style={{ marginTop: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="label">Duration (minutes)</label>
              <input type="number" className="input" min={2} max={20} value={payload.durationMinutes}
                     onChange={e => setPayload(p => ({ ...p, durationMinutes: Number(e.target.value) }))} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Style</label>
              <select className="select" value={payload.style}
                      onChange={e => setPayload(p => ({ ...p, style: e.target.value as any }))}>
                <option value="educational">Educational</option>
                <option value="storytelling">Storytelling</option>
                <option value="cinematic">Cinematic</option>
                <option value="listicle">Listicle</option>
                <option value="tutorial">Tutorial</option>
                <option value="news">News</option>
              </select>
            </div>
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="label">Audience</label>
              <select className="select" value={payload.audience}
                      onChange={e => setPayload(p => ({ ...p, audience: e.target.value as any }))}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Tone</label>
              <select className="select" value={payload.tone}
                      onChange={e => setPayload(p => ({ ...p, tone: e.target.value as any }))}>
                <option value="friendly">Friendly</option>
                <option value="authoritative">Authoritative</option>
                <option value="humorous">Humorous</option>
                <option value="inspiring">Inspiring</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label className="label">Language</label>
            <input className="input" value={payload.language} onChange={e => setPayload(p => ({ ...p, language: e.target.value }))} />
          </div>
          <div className="row" style={{ marginTop: 16 }}>
            <button className="button" onClick={generate} disabled={loading}>
              {loading ? 'Generating?' : 'Generate'}
            </button>
            {error && <span className="small" style={{ color: '#b91c1c' }}>{error}</span>}
          </div>
        </div>
        <div className="card">
          {!data && <div className="small">Fill the form and click Generate. Your full video package will appear here.</div>}
          {data && (
            <div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="section-title">Idea</div>
                <Copy text={JSON.stringify(data.idea, null, 2)} />
              </div>
              <div className="kv">
                <div className="key">Title</div><div className="value">{data.idea.title}</div>
                <div className="key">Hook</div><div className="value">{data.idea.hook}</div>
                <div className="key">Angle</div><div className="value">{data.idea.angle}</div>
                <div className="key">Value Props</div><div className="value">{data.idea.valueProps.join(' ? ')}</div>
              </div>
              <hr />

              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="section-title">Outline</div>
                <Copy text={JSON.stringify(data.outline, null, 2)} />
              </div>
              <div>
                {data.outline.map(sec => (
                  <div key={sec.id} style={{ marginBottom: 8 }}>
                    <div><strong>{sec.title}</strong></div>
                    <ul style={{ margin: 0 }}>
                      {sec.bullets.map((b, i) => (<li key={i}>{b}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
              <hr />

              <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="section-title">Script & Timeline</div>
                <Copy text={JSON.stringify(data.script, null, 2)} />
              </div>
              <div className="code">
                {data.script.segments.map(s => (
                  <div key={s.id} style={{ marginBottom: 10 }}>
                    <div>#{s.id} [{s.start} -&gt; {s.end}]</div>
                    <div>On-screen: {s.onScreenText}</div>
                    <div>VO: {s.voiceover}</div>
                    <div>B-roll: {s.brollSuggestions.join('; ')}</div>
                  </div>
                ))}
              </div>

              <div className="row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
                <div className="section-title">Voiceover (Plain)</div>
                <Copy text={data.voiceover.plain} />
              </div>
              <div className="code" style={{ whiteSpace: 'pre-wrap' }}>{data.voiceover.plain}</div>

              <div className="row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
                <div className="section-title">Voiceover (SSML)</div>
                <Copy text={data.voiceover.ssml} />
              </div>
              <div className="code" style={{ whiteSpace: 'pre' }}>{data.voiceover.ssml}</div>

              <div className="row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
                <div className="section-title">Images</div>
                <Copy text={JSON.stringify(data.images, null, 2)} />
              </div>
              <div>
                <div style={{ marginBottom: 8 }}>
                  <div><strong>Thumbnail</strong> - {data.images.thumbnail.alt}</div>
                  <div className="small">Prompt: {data.images.thumbnail.prompt}</div>
                  {data.images.thumbnail.suggestedSource && (
                    <div className="small">Unsplash: <a href={data.images.thumbnail.suggestedSource} target="_blank">Open</a></div>
                  )}
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {data.images.gallery.map(img => (
                    <div className="card" key={img.id}>
                      <div className="small"><strong>{img.purpose.toUpperCase()}</strong></div>
                      <div style={{ fontWeight: 600 }}>{img.alt}</div>
                      <div className="small" style={{ marginTop: 6 }}>Prompt: {img.prompt}</div>
                      {img.suggestedSource && (
                        <div className="small">Unsplash: <a href={img.suggestedSource} target="_blank">Open</a></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
                <div className="section-title">Editing Instructions</div>
                <Copy text={JSON.stringify(data.editing, null, 2)} />
              </div>
              <div className="code" style={{ whiteSpace: 'pre' }}>{JSON.stringify(data.editing, null, 2)}</div>

              <div className="row" style={{ justifyContent: 'space-between', marginTop: 12 }}>
                <div className="section-title">Metadata</div>
                <Copy text={JSON.stringify(data.metadata, null, 2)} />
              </div>
              <div className="code" style={{ whiteSpace: 'pre' }}>{JSON.stringify(data.metadata, null, 2)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
