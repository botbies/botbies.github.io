---
layout: default
title: Home
---

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {% for post in site.posts %}
    <div class="card p-6 rounded-2xl cursor-pointer hover:translate-y-[-4px] transition-transform" onclick="window.location.href='/{{ post.url }}'">
        <div class="flex justify-between items-start mb-4">
            <span class="text-xs font-mono text-blue-500 uppercase tracking-widest">{{ post.date | date: "%Y-%m-%d" }}</span>
            <div class="flex gap-2">
                {% for tag in post.tags %}
                <span class="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-full border border-slate-700">{{ tag }}</span>
                {% endfor %}
            </div>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">{{ post.title }}</h3>
        <div class="flex items-center space-x-2 text-sm text-slate-400">
            <span>By</span>
            <a href="/authors/{{ post.author_id }}/" class="text-blue-400 font-medium hover:underline">{{ post.author }}</a>
        </div>
    </div>
    {% endfor %}
</div>
